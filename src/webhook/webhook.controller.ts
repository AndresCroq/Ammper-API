import { Body, Controller, Post, Res } from '@nestjs/common';
import { WebhookDTO } from './webhook.dto';
import { WebhookService } from './webhook.service';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('actualización')
  handleWebhook(@Body() payload: WebhookDTO, @Res() res: Response) {
    console.log(payload);
    if (payload) {
      res.sendStatus(200);
    }
    if (payload.webhook_type === 'TRANSACTIONS')
      this.webhookService.updateDatabase(payload);
  }
}
