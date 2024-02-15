import { ObjectId } from 'mongoose';

export type RefreshToken = {
  name: string;
  expiration: number;
};

export type CreateRefreshToken = {
  userId: ObjectId;
  token: RefreshToken;
};
