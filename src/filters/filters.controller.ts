import { Controller, Post, Body } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { Filter } from './schemas/filters.schema';
// import { Bank } from 'src/bank/schemas/bank.schema';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  create(@Body() createFilterDto: Filter) {
    return this.filtersService.create(createFilterDto);
  }

  // @Patch()
  // update(@Body() updateFilterDto: Partial<Bank>) {
  //   return this.filtersService.update(updateFilterDto);
  // }
}
