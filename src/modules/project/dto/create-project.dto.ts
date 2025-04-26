import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';

import { LangType } from '@/common/constants/lang-type.enum';

export class CreateProjectDto {
  @ApiProperty({ example: 'myungjoo.dev', description: '프로젝트 key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: LangType.Korean,
    enum: LangType,
    description: '언어 타입',
  })
  @IsNotEmpty()
  lang: LangType;

  @ApiProperty({ example: 'myungjoo.dev', description: '프로젝트 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: ['react', 'typescript'],
    description: '기술 스택',
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tech_stack: string[];

  @ApiProperty({
    example: '/images/thumbnail.png',
    description: '썸네일 이미지 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiProperty({
    example: '저에 대한 소개를 하는 사이트입니다.',
    description: '프로젝트 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://github.com/myungjoo-dev-be',
    description: '깃허브 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  github_url?: string;

  @ApiProperty({
    example: 'https://myungjoo.dev',
    description: '사이트 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  site_url?: string;

  @ApiProperty({ example: 1, description: '정렬 순서', required: false })
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({ example: '2023-01-01', description: '시작일 (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2023-06-30',
    description: '종료일 (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiProperty({ example: 'react', description: '주요 언어/프레임워크' })
  @IsString()
  @IsNotEmpty()
  language: string;
}
