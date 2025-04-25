import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAboutDto {
  @ApiProperty({ example: 'professional', description: 'Tab key 값' })
  @IsString()
  @IsNotEmpty()
  tabKey: string;

  @ApiProperty({ example: 'experience', description: 'Menu key 값' })
  @IsString()
  @IsNotEmpty()
  menuKey: string;

  //   @ApiProperty({
  //     description: 'Menu key 값',
  //     enum: MenuKey,
  //     example: MenuKey.EXPERIENCE,
  //     enumName: 'MenuKey',
  //   })
  //   @IsEnum(MenuKey)
  //   menuKey: MenuKey;

  @ApiProperty({ example: '한국어 내용', description: '한국어 내용' })
  @IsString()
  @IsNotEmpty()
  content_ko: string;

  @ApiProperty({ example: '영어 내용', description: '영어 내용' })
  @IsString()
  @IsNotEmpty()
  content_en: string;
}
