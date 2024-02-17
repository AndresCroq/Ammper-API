import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bank } from './schemas/bank.schema';
import { Model } from 'mongoose';
import { BankTable } from './interfaces/raw.interface';

interface FormattedFilters extends Partial<BankTable> {
  ['account.category']: string;
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
    if (filters) {
      const formattedFilters = this.formatFilters(filters);
      return await this.bankModel
        .find(formattedFilters)
        .limit(limit)
        .skip(skip);
    }
    return await this.bankModel.find().limit(limit).skip(skip);
  }

  private formatFilters(filters: Partial<FormattedFilters>) {
    if (filters.accountCategory) {
      filters['account.category'] = filters.accountCategory;
      delete filters.accountCategory;
    }
    if (filters.merchantName) {
      filters['merchant.name'] = filters.merchantName;
      delete filters.merchantName;
    }
    if (filters.valueDate) {
      filters['value_date'] = filters.valueDate;
      delete filters.valueDate;
    }

    return filters;
  }

  async findOne(id: string) {
    return await this.bankModel.findById(id);
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
