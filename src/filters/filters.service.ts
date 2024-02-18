import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Filter } from './schemas/filters.schema';
import { Model } from 'mongoose';

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Filter.name) private readonly filterModel: Model<Filter>,
  ) {}

  async create(createBankDto: Filter) {
    return await this.filterModel.create(createBankDto);
  }

  // async update(updateFilterDto: UpdateFilterDto) {
  //   const filter = await this.filterModel.findOne();

  //   await filter.updateOne({
  //     accountCategory: { $addToSet: updateFilterDto. }
  //   })
  // }
}
