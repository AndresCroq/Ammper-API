import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { ApiConnectionService } from 'src/api_connection/api_connection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Webhook, WebhookSchema } from './schemas/webhook.schema';
import { ConfigModule } from '@nestjs/config';
import { BankService } from 'src/bank/bank.service';
import { HttpModule } from '@nestjs/axios';
import { ApiConnectionModule } from 'src/api_connection/api_connection.module';
import { BankModule } from 'src/bank/bank.module';

@Module({
  imports: [
    BankModule,
    MongooseModule.forFeature([
      {
        name: Webhook.name,
        schema: WebhookSchema,
      },
    ]),
    ConfigModule,
    HttpModule,
    ApiConnectionModule,
  ],
  controllers: [WebhookController],
  providers: [BankService, WebhookService, ApiConnectionService],
})
export class WebhookModule {}
