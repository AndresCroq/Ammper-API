import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
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
  controllers: [FiltersController],
  providers: [FiltersService],
  exports: [FiltersService, MongooseModule],
})
export class FiltersModule {}
