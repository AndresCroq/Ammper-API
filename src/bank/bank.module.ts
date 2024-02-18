import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from './schemas/bank.schema';
import { FormatterService } from './formatter.service';
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  imports: [
    FiltersModule,
    MongooseModule.forFeature([
      {
        name: Bank.name,
        schema: BankSchema,
      },
    ]),
  ],
  controllers: [BankController],
  providers: [BankService, FormatterService],
  exports: [BankService, MongooseModule],
})
export class BankModule {}
