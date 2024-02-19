import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Filter, FilterSchema } from './schemas/filters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Filter.name,
        schema: FilterSchema,
      },
    ]),
  ],
  providers: [FiltersService],
  exports: [FiltersService, MongooseModule],
})
export class FiltersModule {}
