import { Body, Controller, Post } from '@nestjs/common';
import { WebhookDTO } from './webhook.dto';

@Controller('webhook')
export class WebhookController {
  @Post('actualización')
  handleWebhook(@Body() payload: WebhookDTO) {
    console.log(payload);
    if (payload.webhook_type !== 'TRANSACTIONS') {
      return;
    }
    //Acá tendría que meter la función o la logica que va a actualizar la base de datos
    //
  }
}
