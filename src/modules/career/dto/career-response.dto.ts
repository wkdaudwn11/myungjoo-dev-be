import { ApiProperty } from '@nestjs/swagger';

import { LangType } from '@/common/constants/lang-type.enum';

export class CareerProjectResponseDto {
  @ApiProperty({ example: 'uuid-project-1', description: '프로젝트 ID' })
  id: string;

  @ApiProperty({
    example: 'EzPlay 리뉴얼 및 텔레그램 미니앱 연동',
    description: '프로젝트 제목',
  })
  title: string;

  @ApiProperty({
    example:
      '기존 EzPlay를 포크하여 디자인을 개선하고 텔레그램 로그인 및 미니앱을 추가하여 새로운 도메인으로 재런칭',
    description: '프로젝트 상세 설명',
  })
  description: string;
}

export class CareerResponseDto {
  @ApiProperty({ example: 'uuid-career', description: '경력 ID' })
  id: string;

  @ApiProperty({ example: 'supertree', description: '경력 키 (고유값)' })
  key: string;

  @ApiProperty({
    enum: LangType,
    example: LangType.Korean,
    description: '언어 타입',
  })
  lang: LangType;

  @ApiProperty({
    example: { ko: '㈜ 수퍼트리', en: 'Supertree Corp.' },
    description: '회사/경력 이름',
  })
  name: {
    ko: string;
    en: string;
  };

  @ApiProperty({
    example:
      'PlayDapp 생태계 내에서 블록체인 기반 프론트엔드 플랫폼(마켓, 포털, 미니앱 등) 개발',
    description: '경력 슬로건/주요 설명',
  })
  slogan: string;

  @ApiProperty({
    example: 'Frontend Developer (React, Next.js)',
    description: '역할/직무',
  })
  role: string;

  @ApiProperty({
    example: '/images/supertree.svg',
    description: '회사/경력 로고 URL',
    required: false,
  })
  logoUrl?: string;

  @ApiProperty({
    example: '2021-06-01',
    description: '경력 시작일 (YYYY-MM-DD)',
  })
  startDate: string;

  @ApiProperty({
    example: '2024-12-31',
    description: '경력 종료일 (YYYY-MM-DD)',
  })
  endDate: string;

  @ApiProperty({
    type: [CareerProjectResponseDto],
    description: '경력에 포함된 프로젝트 목록',
  })
  projects: CareerProjectResponseDto[];
}
