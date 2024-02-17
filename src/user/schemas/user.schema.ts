import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: string;

  @Prop()
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
