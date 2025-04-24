import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

import { AboutCategoryType, MenuKey } from '@/common/constants/about.enum';

export class UpdateAboutCategoryDto {
  @ApiProperty({
    description:
      '카테고리 유형 (tab 또는 menu). **type은 수정 불가능합니다. 기존 값을 그대로 보내주세요.**',
    enum: AboutCategoryType,
  })
  @IsEnum(AboutCategoryType)
  type: AboutCategoryType;

  @ApiProperty({
    description: '언어별 이름 (ko, en)',
    example: { ko: '경력', en: 'professional' },
  })
  @IsNotEmpty()
  name: { ko: string; en: string };

  @ValidateIf((o: UpdateAboutCategoryDto) => o.type === AboutCategoryType.TAB)
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
    required: false,
  })
  @IsOptional()
  displayOrder?: number;
}
