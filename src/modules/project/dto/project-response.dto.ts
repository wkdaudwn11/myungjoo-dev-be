import { ApiProperty } from '@nestjs/swagger';

import { LangType } from '@/common/constants/lang-type.enum';

export class ProjectResponseDto {
  @ApiProperty({ example: 'myungjoo.dev', description: '프로젝트 key' })
  key: string;

  @ApiProperty({
    example: LangType.Korean,
    enum: LangType,
    description: '언어 타입',
  })
  lang: LangType;

  @ApiProperty({ example: 'uuid', description: '프로젝트 ID' })
  id: string;

  @ApiProperty({ example: 'myungjoo.dev', description: '프로젝트 제목' })
  title: string;

  @ApiProperty({ example: 'react', description: '주요 언어/프레임워크' })
  language: string;

  @ApiProperty({ example: ['react', 'typescript'], description: '기술 스택' })
  tech_stack: string[];

  @ApiProperty({
    example: '/images/thumbnail.png',
    description: '썸네일 이미지 URL',
    required: false,
  })
  thumbnail_url?: string;

  @ApiProperty({
    example: '저에 대한 소개를 하는 사이트입니다.',
    description: '프로젝트 설명',
  })
  description: string;

  @ApiProperty({
    example: 'https://github.com/myungjoo-dev',
    description: '깃허브 URL',
    required: false,
  })
  github_url?: string;

  @ApiProperty({
    example: 'https://myungjoo.dev',
    description: '사이트 URL',
    required: false,
  })
  site_url?: string;

  @ApiProperty({ example: 1, description: '정렬 순서', required: false })
  displayOrder?: number;

  @ApiProperty({ example: '2023-01-01', description: '시작일 (YYYY-MM-DD)' })
  startDate: string;

  @ApiProperty({
    example: '2023-06-30',
    description: '종료일 (YYYY-MM-DD)',
    required: false,
  })
  endDate?: string | null;
}
