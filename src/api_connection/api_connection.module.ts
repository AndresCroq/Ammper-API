import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConnectionService } from './api_connection.service';
import { ApiConnectionController } from './api_connection.controller';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [ApiConnectionService],
  controllers: [ApiConnectionController],
})
export class ApiConnectionModule {}
