import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IWebhook } from './webhook.interface';
import { ApiConnectionService } from 'src/api_connection/api_connection.service';
import { InjectModel } from '@nestjs/mongoose';
import { Webhook } from './schemas/webhook.schema';
import { Model } from 'mongoose';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(Webhook.name) private readonly webhookModel: Model<Webhook>,
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
    private apiConnectionService: ApiConnectionService,
  ) {}

  /**
   * This private function is to find if the notification already exist (on a first instance) if not, it creates it.
   * @param date string
   * @param name string
   * @returns the full notification itself.
   */
  private async findOrCreateNotification(
    date: string,
    name: string = 'notification_check',
  ) {
    let notification: Webhook = await this.webhookModel.findOne({
      name,
    });
    if (!notification) {
      notification = await this.webhookModel.create({
        name,
        last_noti_date: date,
      });
    }
    return notification;
  }

  /**
   *
   * @param date A Javascript "DATE" form
   * @param format The structure desired in yyyy-mm-dd string
   * @returns the actual date formated as a string.
   */
  private dateFormater(date: Date, format: string) {
    const map = {
      dd: date.getDate(),
      mm: (date.getMonth() + 1).toString().padStart(2, '0'),
      yyyy: date.getFullYear(),
    };
    return format.replace(/dd|mm|yyyy/gi, (matched) => map[matched]);
  }

  private async updateNotification(date: string) {
    await this.webhookModel.findOneAndUpdate(
      { name: 'notification_check' },
      { last_noti_date: date },
    );
    return;
  }

  /**
   * This function updates the "bank" info, beeing this all the transactions.
   * @param payload
   * @returns
   */
  async updateDatabase(payload: IWebhook) {
    try {
      if (this.configService.get<string>('ENVIROMENT') === 'DEV') {
        console.log(payload);
      }
      const newDate = this.dateFormater(new Date(), 'yyyy-mm-dd');
      const notification = await this.findOrCreateNotification(
        newDate,
        'notification_check',
      );

      await this.apiConnectionService.updateDB(
        payload.link_id,
        newDate,
        notification.last_noti_date,
      );

      await this.updateNotification(newDate);

      return;
    } catch (error) {
      throw new Error(error);
    }
  }
}
