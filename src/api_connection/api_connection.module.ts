import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConnectionService } from './api_connection.service';
import { ApiConnectionController } from './api_connection.controller';
import { BankService } from 'src/bank/bank.service';
import { BankModule } from 'src/bank/bank.module';

@Module({
  imports: [BankModule, ConfigModule, HttpModule],
  providers: [ApiConnectionService, BankService],
  controllers: [ApiConnectionController],
  exports: [ApiConnectionService],
})
export class ApiConnectionModule {}
