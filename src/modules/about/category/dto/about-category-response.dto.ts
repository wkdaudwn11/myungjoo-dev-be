import { ApiProperty } from '@nestjs/swagger';

import { AboutCategoryType, MenuKey } from '@/common/constants/about.enum';

export class AboutCategoryResponseDto {
  @ApiProperty({ description: 'UUID 형식의 고유 ID', example: 'uuid-1234' })
  id: string;

  @ApiProperty({
    description: '카테고리 유형 (tab 또는 menu)',
    enum: AboutCategoryType,
  })
  type: AboutCategoryType;

  @ApiProperty({
    description: '카테고리 키 (고유값)',
    enum: MenuKey,
  })
  key: MenuKey;

  @ApiProperty({
    description: 'tab 또는 menu 이름',
    example: '경력',
  })
  name: string;

  @ApiProperty({
    description: 'TAB 타입일 경우, 포함된 메뉴 key 리스트',
    required: false,
    type: [String],
    enum: MenuKey,
  })
  menus: MenuKey[] | null;

  @ApiProperty({
    description: '정렬 순서를 위한 숫자 값',
    example: 1,
  })
  displayOrder: number;
}
