import { User } from 'src/user/schemas/user.schema';

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = User & TokenResponse;
