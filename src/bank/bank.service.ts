import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bank } from './schemas/bank.schema';
import { Model } from 'mongoose';
import { BankTable } from './interfaces/raw.interface';

interface FormattedFilters extends Partial<BankTable> {
  ['account.category']: string;
  ['fromDate']: string;
  ['toDate']: string;
}

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
  ) {}

  async create(createBankDto: CreateBankDto) {
    return await this.bankModel.create(createBankDto);
  }

  async findAll(limit: number, skip: number, filters?: Partial<BankTable>) {
    return await this.bankModel.find(filters).limit(limit).skip(skip);
  }

  formatFilters(filters: Partial<FormattedFilters>) {
    filters.amount = { $lte: 1000 } as unknown as number;
    if (filters.accountCategory) {
      filters['account.category'] = filters.accountCategory;
      delete filters.accountCategory;
    }
    if (filters.merchantName) {
      filters['merchant.name'] = filters.merchantName;
      delete filters.merchantName;
    }

    if (filters.fromDate && !filters.toDate) {
      const date = new Date(filters.fromDate);

      filters['value_date'] = {
        $gte: date.toISOString().split('T')[0],
      };

      delete filters.fromDate;
    }
    if (filters.toDate && !filters.fromDate) {
      const date = new Date(filters.toDate);

      filters['value_date'] = {
        $lte: date.toISOString().split('T')[0],
      };
      delete filters.toDate;
    }
    if (filters.toDate && filters.fromDate) {
      const firstDate = new Date(filters.fromDate);
      const date = new Date(filters.toDate);

      filters['value_date'] = {
        $gte: firstDate.toISOString().split('T')[0],
        $lte: date.toISOString().split('T')[0],
      };

      delete filters.fromDate;
      delete filters.toDate;
    }

    return filters;
  }

  async findOne(id: string) {
    return await this.bankModel.findById(id);
  }

  async count({ ...filters }: Partial<FormattedFilters>) {
    return await this.bankModel.countDocuments(filters).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
