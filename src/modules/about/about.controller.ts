import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AboutService } from './about.service';
import { AboutResponseDto } from './dto/about-response.dto';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

import { LangType } from '@/common/constants/lang-type.enum';

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'About 등록',
    description: 'About 페이지의 내용을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'About 등록 성공',
    type: AboutResponseDto,
  })
  @ApiResponse({ status: 400, description: '요청 값 오류' })
  @ApiResponse({ status: 409, description: '중복된 tabKey/menuKey 조합 존재' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  create(@Body() dto: CreateAboutDto): Promise<AboutResponseDto> {
    return this.aboutService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'About 조회',
    description: 'tabKey와 menuKey로 About 페이지의 내용을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'About 조회 성공',
    type: AboutResponseDto,
  })
  @ApiResponse({ status: 400, description: '요청 값 오류' })
  @ApiResponse({ status: 404, description: '데이터를 찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  findByKeys(
    @Query('tabKey') tabKey: string,
    @Query('menuKey') menuKey: string,
    @Query('lang') lang: LangType,
  ): Promise<AboutResponseDto> {
    return this.aboutService.findByKeys(tabKey, menuKey, lang);
  }

  @Put(':tabKey/:menuKey')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'About 수정',
    description: 'About 페이지의 내용을 수정합니다.',
  })
  @ApiParam({
    name: 'tabKey',
    required: true,
    description: '탭 키',
  })
  @ApiParam({
    name: 'menuKey',
    required: true,
    description: '메뉴 키',
  })
  @ApiResponse({
    status: 200,
    description: 'About 수정 성공',
    type: AboutResponseDto,
  })
  @ApiResponse({ status: 400, description: '요청 값 오류' })
  @ApiResponse({ status: 404, description: '데이터를 찾을 수 없음' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  update(
    @Param('tabKey') tabKey: string,
    @Param('menuKey') menuKey: string,
    @Body() dto: UpdateAboutDto,
  ): Promise<AboutResponseDto> {
    return this.aboutService.update(tabKey, menuKey, dto);
  }
}
