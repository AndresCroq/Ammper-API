import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Filter } from './schemas/filters.schema';
import { Model } from 'mongoose';
import { Bank } from 'src/bank/schemas/bank.schema';

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Filter.name) private readonly filterModel: Model<Filter>,
  ) {}

  async create(createBankDto: Filter) {
    return await this.filterModel.create(createBankDto);
  }

  async update(updateFilterDto: Partial<Bank>) {
    const filter = await this.filterModel.findOne();

    await filter.updateOne({
      $addToSet: {
        accountCategory: updateFilterDto?.account?.category,
        category: updateFilterDto?.category,
        merchantName: updateFilterDto?.merchant?.name,
        valueDate: updateFilterDto?.value_date,
        amount: Math.floor(updateFilterDto?.amount),
        type: updateFilterDto?.type,
        status: updateFilterDto?.status,
        balance: Math.floor(updateFilterDto?.balance),
      },
    });
  }

  async findOne() {
    return await this.filterModel.findOne();
  }
}
