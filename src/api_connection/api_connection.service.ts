import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILink } from './interfaces/link.interface';

@Injectable()
export class ApiConnectionService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
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
      console.log('pre');
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

  /* Obtain users needed to generate a link */
  async getUsers() {}

  async checkLinkExistence(institution: string): Promise<ILink> {
    return (await this.getAllLinks()).results.find(
      (link: ILink) => institution === link.institution,
    );
  }

  /* Obtain Transactions (can be filtered to date) */
  /**
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
          { ...this.options, params: { link: link.id } },
        )
      ).data;
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}
