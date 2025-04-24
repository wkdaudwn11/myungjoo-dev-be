import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CreateHelloDto } from './dto/create-hello.dto';
import { HelloResponseDto } from './dto/hello-response.dto';
import { HelloService } from './hello.service';

import { LangType } from '@/common/constants/lang-type.enum';

@ApiTags('Hello')
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Hello 데이터 생성',
    description: '새로운 hello 데이터 등록',
  })
  @ApiResponse({
    status: 201,
    description: '등록 성공',
    type: HelloResponseDto,
  })
  @ApiResponse({ status: 400, description: '입력 값 검증 실패' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  create(@Body() dto: CreateHelloDto): Promise<HelloResponseDto> {
    return this.helloService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hello 데이터 조회',
    description: '언어(lang) 기준으로 hello 데이터 조회',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: HelloResponseDto,
  })
  @ApiResponse({ status: 404, description: '해당 언어 데이터 없음' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  findByLang(@Query('lang') lang: LangType): Promise<HelloResponseDto> {
    return this.helloService.findByLang(lang);
  }

  @Put(':lang')
  @Throttle({ medium: { limit: 20, ttl: 10000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hello 정보 수정',
    description: 'lang 기반 hello 정보 수정',
  })
  @ApiParam({ name: 'lang', description: 'ko 또는 en', enum: LangType })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
    type: HelloResponseDto,
  })
  @ApiResponse({ status: 400, description: '입력 값 검증 실패' })
  @ApiResponse({ status: 404, description: 'lang에 해당하는 데이터 없음' })
  @ApiResponse({ status: 500, description: '서버 내부 오류' })
  update(
    @Param('lang') lang: LangType,
    @Body() dto: CreateHelloDto,
  ): Promise<HelloResponseDto> {
    return this.helloService.updateByLang(lang, dto);
  }
}
