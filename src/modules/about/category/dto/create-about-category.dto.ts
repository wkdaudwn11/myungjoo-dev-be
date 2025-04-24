import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  ValidateIf,
  Max,
} from 'class-validator';

import { AboutCategoryType, MenuKey } from '@/common/constants/about.enum';

export class CreateAboutCategoryDto {
  @ApiProperty({ example: 'professional', description: '카테고리 키 (고유값)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: '카테고리 유형 (tab 또는 menu)',
    enum: AboutCategoryType,
    example: AboutCategoryType.TAB,
  })
  @IsEnum(AboutCategoryType)
  type: AboutCategoryType;

  @ApiProperty({
    description: '언어별 이름 (ko, en)',
    example: { ko: '경력', en: 'professional' },
  })
  @IsNotEmpty()
  name: {
    ko: string;
    en: string;
  };

  @ValidateIf((o: CreateAboutCategoryDto) => o.type === AboutCategoryType.TAB)
  @ApiProperty({
    description:
      'TAB 타입일 경우, 포함된 메뉴 key 리스트 (menu 타입의 key만 허용)',
    example: ['experience', 'hard-skills', 'soft-skills'],
    required: false,
    isArray: true,
    enum: MenuKey,
    enumName: 'MenuKey',
  })
  @IsEnum(MenuKey, { each: true })
  menus: MenuKey[] | null;

  @ApiProperty({
    description: '정렬 순서를 위한 숫자 값',
    example: 1,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  displayOrder?: number;
}
