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
import { BankInterceptor } from './bank.interceptor';
import { BankTable } from './interfaces/raw.interface';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}
  @UseInterceptors(BankInterceptor)
  @Post()
  async findAll(
    @Query() { limit, skip }: { limit: string; skip: string },
    @Body() body: Partial<BankTable>,
  ) {
    if (!limit || !skip) throw new BadRequestException('Agregar limit y skip.');
    const filters = this.bankService.formatFilters(body);
    const count = await this.bankService.count(filters);
    const banks = await this.bankService.findAll(+limit, +skip, filters);

    return { count, banks };
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
