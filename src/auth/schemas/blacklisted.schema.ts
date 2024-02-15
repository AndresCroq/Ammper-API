import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Blacklisted extends Document {
  @IsString()
  @Prop()
  token: string;

  @IsNumber()
  @Prop()
  expiration: number;
}

const BlacklistedSchema = SchemaFactory.createForClass(Blacklisted);

export const BlacklistedMongooseModule = MongooseModule.forFeature(
  [
    {
      name: Blacklisted.name,
      schema: BlacklistedSchema,
    },
  ],
  'DIARY',
);
