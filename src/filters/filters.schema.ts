import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Filter extends Document {
  @Prop()
  account: string[];

  @Prop()
  created_at: string[];

  @Prop()
  category: string[];

  @Prop()
  subcategory: string[];

  @Prop()
  merchant: string[];

  @Prop()
  collected_at: string[];

  @Prop()
  currency: string[];

  @Prop()
  description: string[];

  @Prop()
  internal_identification: string[];

  @Prop()
  value_date: string[];

  @Prop()
  accounting_date: string[];

  @Prop()
  amount: number[];

  @Prop()
  type: string[];

  @Prop()
  status: string[];

  @Prop()
  balance: number[];
}

export const FilterSchema = SchemaFactory.createForClass(Filter);
