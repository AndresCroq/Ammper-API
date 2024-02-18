import { Controller, Post, Body } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { Filter } from './schemas/filters.schema';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  create(@Body() createFilterDto: Filter) {
    return this.filtersService.create(createFilterDto);
  }

  // @Patch()
  // update(@Body() updateFilterDto: UpdateFilterDto) {
  //   return this.filtersService.update(updateFilterDto);
  // }
}
