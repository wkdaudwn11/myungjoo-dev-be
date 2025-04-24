import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Post,
  Put,
  Param,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AboutCategoryService } from './about-category.service';
import { AboutCategoryResponseDto } from './dto/about-category-response.dto';
import { CreateAboutCategoryDto } from './dto/create-about-category.dto';
import { UpdateAboutCategoryDto } from './dto/update-about-category.dto';

import { MenuKey } from '@/common/constants/about.enum';
import { LangType } from '@/common/constants/lang-type.enum';

@ApiTags('AboutCategory')
@Controller('about/category')
export class AboutCategoryController {
  constructor(private readonly aboutCategoryService: AboutCategoryService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'About 카테고리 등록',
    description: 'About 페이지의 카테고리(tab, menu)를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '카테고리 등록 성공',
    type: AboutCategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: '요청 값 오류' })
  @ApiResponse({ status: 409, description: '중복된 key/type 조합 존재' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  create(
    @Body() dto: CreateAboutCategoryDto,
  ): Promise<AboutCategoryResponseDto> {
    return this.aboutCategoryService.create(dto);
  }

  @Get()
  @Throttle({ default: { limit: 20, ttl: 10_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'About 카테고리 목록 조회',
    description: '등록된 About 카테고리 목록을 언어(lang) 기준으로 조회합니다.',
  })
  @ApiQuery({
    name: 'lang',
    description: 'ko 또는 en',
    example: 'ko',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리 조회 성공',
    type: AboutCategoryResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'lang 값 오류' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  findAllByLang(
    @Query('lang') lang: LangType,
  ): Promise<AboutCategoryResponseDto[]> {
    return this.aboutCategoryService.findAllByLang(lang);
  }

  @Put(':key')
  @Throttle({ medium: { limit: 20, ttl: 10000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'About Category 수정',
    description:
      'key 값을 기준으로 About Category 정보를 수정합니다. **(type은 수정 불가합니다. 기존 값을 그대로 보내주세요.)**',
  })
  @ApiParam({
    name: 'key',
    description: 'About Category 고유 키',
    enum: MenuKey,
  })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
    type: AboutCategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: '유효하지 않은 요청 형식' })
  @ApiResponse({
    status: 404,
    description: '해당 key를 가진 카테고리가 존재하지 않음',
  })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  update(
    @Param('key') key: MenuKey,
    @Body() dto: UpdateAboutCategoryDto,
  ): Promise<AboutCategoryResponseDto> {
    return this.aboutCategoryService.updateByKey(key, dto);
  }
}
