import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Account, Merchant } from '../interfaces/bank.interface';

@Schema()
export class Bank extends Document {
  @Prop()
  id: string;

  @Prop({ type: SchemaTypes.Mixed })
  account: Account;

  @Prop()
  created_at: string;

  @Prop()
  category: string;

  @Prop()
  subcategory: string;

  @Prop({ type: SchemaTypes.Mixed })
  merchant: Merchant;

  @Prop()
  collected_at: string;

  @Prop()
  currency: string;

  @Prop()
  description: string;

  @Prop()
  internal_identification: string;

  @Prop()
  value_date: string;

  @Prop()
  accounting_date: string;

  @Prop()
  amount: number;

  @Prop()
  type: string;

  @Prop()
  status: string;

  @Prop()
  reference: string;

  @Prop()
  balance: number;

  @Prop()
  observations: null | string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
