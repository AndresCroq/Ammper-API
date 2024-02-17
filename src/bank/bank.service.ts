import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bank } from './schemas/bank.schema';
import { Model } from 'mongoose';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank.name) private readonly bankModel: Model<Bank>,
  ) {}

  async create(createBankDto: CreateBankDto) {
    return await this.bankModel.create(createBankDto);
  }

  async findAll(limit: number, skip: number) {
    return await this.bankModel.find().limit(limit).skip(skip);
  }

  async findOne(id: string) {
    return await this.bankModel.findById(id);
  }

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
