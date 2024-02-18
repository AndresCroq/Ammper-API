import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Filter extends Document {
  @Prop()
  accountCategory: string[];

  @Prop()
  category: string[];

  @Prop()
  merchantName: string[];

  @Prop()
  currency: string[];

  @Prop()
  valueDate: string[];

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
