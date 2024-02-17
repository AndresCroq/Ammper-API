import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { BankInterceptor } from './bank.interceptor';
import { BankTable } from './interfaces/raw.interface';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }

  @UseInterceptors(BankInterceptor)
  @Get()
  findAll(
    @Query() { limit, skip }: { limit: string; skip: string },
    @Body() body: Partial<BankTable>,
  ) {
    if (!limit || !skip) throw new BadRequestException('Agregar limit y skip.');
    return this.bankService.findAll(+limit, +skip, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankService.remove(+id);
  }
}
