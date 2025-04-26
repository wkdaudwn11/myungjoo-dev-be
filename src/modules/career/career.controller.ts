import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { Career } from './entities/career.entity';

@ApiTags('Career')
@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '경력 등록',
    description: '경력 및 프로젝트 일괄 등록',
  })
  @ApiResponse({ status: 201, description: '경력 등록 성공', type: Career })
  @ApiResponse({ status: 400, description: '요청 형식 오류' })
  async create(@Body() createCareerDto: CreateCareerDto): Promise<Career> {
    return this.careerService.create(createCareerDto);
  }
}
