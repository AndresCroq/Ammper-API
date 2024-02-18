import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Webhook extends Document {
  @Prop()
  name: string;

  @Prop()
  last_noti_date: string;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);
