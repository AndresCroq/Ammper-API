import { ObjectId } from 'mongoose';

export type JwtPayload = { id: ObjectId };

export type RefreshPayload = JwtPayload & { key: string };
