import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { LangType } from '@/common/constants/lang-type.enum';

export class CreateCareerProjectDto {
  @ApiProperty({
    example: 'EzPlay 리뉴얼 및 텔레그램 미니앱 연동',
    description: '프로젝트 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      '기존 EzPlay를 포크하여 디자인을 개선하고 텔레그램 로그인 및 미니앱을 추가하여 새로운 도메인으로 재런칭',
    description: '프로젝트 상세 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateCareerDto {
  @ApiProperty({ example: 'supertree', description: '경력 키 (고유값)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    enum: LangType,
    example: LangType.Korean,
    description: '언어 타입',
  })
  @IsEnum(LangType)
  lang: LangType;

  @ApiProperty({ example: '㈜ 수퍼트리', description: '회사/경력 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example:
      'PlayDapp 생태계 내에서 블록체인 기반 프론트엔드 플랫폼(마켓, 포털, 미니앱 등) 개발',
    description: '경력 슬로건/주요 설명',
  })
  @IsString()
  @IsNotEmpty()
  slogan: string;

  @ApiProperty({
    example: 'Frontend Developer (React, Next.js)',
    description: '역할/직무',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    example: '/images/supertree.svg',
    required: false,
    description: '회사/경력 로고 URL',
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    example: '2021-06-01',
    description: '경력 시작일 (YYYY-MM-DD)',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2024-12-31',
    description: '경력 종료일 (YYYY-MM-DD)',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    type: [CreateCareerProjectDto],
    description: '경력에 포함된 프로젝트 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCareerProjectDto)
  projects: CreateCareerProjectDto[];
}
