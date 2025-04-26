import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

import { CareerService } from './career.service';
import { CareerResponseDto } from './dto/career-response.dto';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

import { LangType } from '@/common/constants/lang-type.enum';

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
  @ApiResponse({
    status: 201,
    description: '경력 등록 성공',
    type: CareerResponseDto,
  })
  @ApiResponse({ status: 400, description: '요청 형식 오류' })
  async create(
    @Body() createCareerDto: CreateCareerDto,
  ): Promise<CareerResponseDto> {
    return this.careerService.create(createCareerDto);
  }

  @Get()
  @ApiOperation({
    summary: '경력 조회',
    description: '언어별 경력 조회',
  })
  @ApiResponse({
    status: 200,
    description: '경력 조회 성공',
    type: CareerResponseDto,
  })
  @ApiResponse({ status: 404, description: '경력이 존재하지 않음' })
  async findOneByLang(
    @Query('lang') lang: LangType,
  ): Promise<CareerResponseDto> {
    return this.careerService.findOneByLang(lang);
  }

  @Put(':key/:lang')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '경력 수정',
    description: '경력 및 프로젝트 일괄 수정',
  })
  @ApiParam({ name: 'key', description: '경력 고유 키' })
  @ApiParam({ name: 'lang', description: '언어 코드', enum: LangType })
  @ApiResponse({
    status: 200,
    description: '경력 수정 성공',
    type: CareerResponseDto,
  })
  @ApiResponse({ status: 404, description: '경력이 존재하지 않음' })
  async updateByKeyAndLang(
    @Param('key') key: string,
    @Param('lang') lang: LangType,
    @Body() dto: UpdateCareerDto,
  ): Promise<CareerResponseDto> {
    return this.careerService.updateByKeyAndLang(key, lang, dto);
  }
}
