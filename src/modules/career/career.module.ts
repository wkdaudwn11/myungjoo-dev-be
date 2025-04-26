import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { CareerProject } from './entities/career-project.entity';
import { Career } from './entities/career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Career, CareerProject])],
  controllers: [CareerController],
  providers: [CareerService],
})
export class CareerModule {}
