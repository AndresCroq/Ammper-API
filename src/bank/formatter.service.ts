import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bank } from './schemas/bank.schema';
import { Model } from 'mongoose';

@Injectable()
export class FormatterService {
  constructor(
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
  ) {}

  format(method: string, data: Bank[]) {
    switch (method) {
      case 'bars':
        return this.bars(data);
    }
  }

  private bars(data: Bank[]) {}
}
