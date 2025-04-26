import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'myungjoo.dev',
    description: '프로젝트 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'react',
    description: '주요 언어/프레임워크',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    example: ['react', 'typescript'],
    description: '기술 스택',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tech_stack?: string[];

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
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://github.com/myungjoo-dev',
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

  @ApiProperty({
    example: '2023-01-01',
    description: '시작일 (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2023-06-30',
    description: '종료일 (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
