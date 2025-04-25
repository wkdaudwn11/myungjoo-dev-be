import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AboutService } from './about.service';
import { AboutResponseDto } from './dto/about-response.dto';
import { CreateAboutDto } from './dto/create-about.dto';

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
}
