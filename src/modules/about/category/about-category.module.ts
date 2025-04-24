import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AboutCategoryController } from './about-category.controller';
import { AboutCategoryService } from './about-category.service';
import { AboutCategory } from './entities/about-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AboutCategory])],
  controllers: [AboutCategoryController],
  providers: [AboutCategoryService],
})
export class AboutCategoryModule {}
