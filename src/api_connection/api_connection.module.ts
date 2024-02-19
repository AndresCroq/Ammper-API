import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConnectionService } from './api_connection.service';
import { ApiConnectionController } from './api_connection.controller';
/* import { BankService } from 'src/bank/bank.service'; */
import { BankModule } from 'src/bank/bank.module';
/* import { FiltersService } from 'src/filters/filters.service'; */
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  imports: [FiltersModule, BankModule, ConfigModule, HttpModule],
  providers: [ApiConnectionService],
  controllers: [ApiConnectionController],
  exports: [ApiConnectionService],
})
export class ApiConnectionModule {}
