import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILink } from './interfaces/link.interface';
import { BankService } from 'src/bank/bank.service';
import { Bank } from 'src/bank/interfaces/bank.interface';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class ApiConnectionService {
  constructor(
    @Inject(forwardRef(() => FiltersService))
    private readonly filterService: FiltersService,
    @Inject(forwardRef(() => BankService))
    private readonly bankService: BankService,
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  private belvoSandboxLink =
    this.configService.get<string>('BELVO_SANBOX_LINK');

  private credentials = Buffer.from(
    `${this.configService.get<string>('SECRET_ID')}:${this.configService.get<string>('SECRET_PASSWORD')}`,
  ).toString('base64');

  private options = { headers: { Authorization: `Basic ${this.credentials}` } };

  /**
   * Get all liks from the api.
   *
   * @returns data
   */
  async getAllLinks() {
    return (
      await this.httpService.axiosRef.get(
        `${this.belvoSandboxLink}/links`,
        this.options,
      )
    ).data;
  }

  /**
   * This function gives the details of an already generated link
   *
   * @param link Link already generated
   * @returns
   */
  async getLinkDetail(link: string) {
    return (
      await this.httpService.axiosRef.get(
        `${this.belvoSandboxLink}/${link}`,
        this.options,
      )
    ).data;
  }

  /**
   * Generate a new Link for the trasnactions list
   *
   * @param institution institution name required
   * @param username username required for transactions
   * @param password password not required
   */
  async generateLink(institution: string, username: string, password?: string) {
    try {
      const body = JSON.stringify({
        access_mode: 'recurrent',
        institution,
        password,
        username,
      });
      const expandedOptions = {
        headers: {
          ...this.options.headers,
          'content-type': 'application/json',
        },
      };
      const response = (
        await this.httpService.axiosRef.post(
          `${this.belvoSandboxLink}/links`,
          body,
          expandedOptions,
        )
      ).data;
      return response;
    } catch (error) {
      console.log('error', error.response.data, 'error');
      throw new Error(error);
    }
  }

  /**
   * Obtain all institutions with their ID
   *
   * The purpose of this function is to generate links in other function
   *
   * @returns
   */
  async getInstitutions() {
    return (
      await this.httpService.axiosRef.get(
        `${this.belvoSandboxLink}/institutions`,
        this.options,
      )
    ).data;
  }

  /**
   * This method checks if the link between an institution and it's user already exists
   *
   * @param institution String
   * @returns The link structure
   */
  async checkLinkExistence(institution: string): Promise<ILink> {
    return (await this.getAllLinks()).results.find(
      (link: ILink) => institution === link.institution,
    );
  }

  /**
   * Obtain Transactions (can be filtered to date)
   *
   * @param institution
   * @param username
   * @param password
   * @param date_from
   * @param date_to
   * @returns
   */
  async getTransactions(
    institution: string,
    username: string,
    password: string,
    date_from?: string,
    date_to?: string,
    limit: number = 500,
  ) {
    try {
      let link = await this.checkLinkExistence(institution);
      if (!link) {
        link = await this.generateLink(institution, username, password);
      }
      if (date_from && date_to) {
        const body = JSON.stringify({
          save_data: true,
          date_to,
          date_from,
          link: link.id,
        });
        return (
          await this.httpService.axiosRef.post(
            `${this.belvoSandboxLink}/transactions/`,
            body,
          )
        ).data;
      }
      const response = (
        await this.httpService.axiosRef.get(
          `${this.belvoSandboxLink}/transactions/`,
          { ...this.options, params: { link: link.id, page_size: limit } },
        )
      ).data;
      let flag = response.next;
      let page = 2;
      while (flag) {
        const result = (
          await this.httpService.axiosRef.get(
            `${this.belvoSandboxLink}/transactions/`,
            {
              ...this.options,
              params: { link: link.id, page_size: limit, page },
            },
          )
        ).data;
        response.results = [...response.results, ...result.results];
        flag = result.next;
        page++;
      }
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * This method should update the Database
   * It was created to update de DB after a Webhook notification.
   *
   * @param link_id
   * @param notifDate Actual Date
   * @param lastNotifDate Last Date. Get it from DB
   */
  async updateDB(linkId: string, notifDate: string, lastNotifDate: string) {
    try {
      const data = (
        await this.httpService.axiosRef.get(
          `${this.belvoSandboxLink}/transactions/?link=${linkId}&created_at__range=${lastNotifDate},${notifDate}`,
          this.options,
        )
      ).data;
      data.results.forEach(async (transaction: Bank) => {
        await this.bankService.create(transaction);
        await this.filterService.update(transaction);
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * This method is to update through a single route all the databse.
   *
   * @returns boolean
   */
  async updateAllTransactions() {
    try {
      const transactions = await this.getTransactions(
        'erebor_mx_retail',
        'bnk100',
        'full',
      );
      const dbTransactions = await this.bankService.findAll(
        transactions.results.length,
        0,
      );
      const promiseT = transactions.results.map(async (el) => {
        if (this.checkTransactionExistanse(el.id, dbTransactions)) {
          return;
        }
        return await this.bankService.create(el);
      });
      await Promise.all(promiseT);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * This method checks if the transactions exists on our database
   *
   * @param transaction_id string
   * @param db_trasactions_array array
   * @returns
   */
  private checkTransactionExistanse(
    transaction_id: string,
    db_trasactions_array,
  ) {
    if (db_trasactions_array.find((el: Bank) => el.id === transaction_id))
      return true;
    return false;
  }
}
