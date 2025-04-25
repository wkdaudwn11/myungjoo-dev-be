import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateAboutDto {
  @ApiProperty({
    description: '한국어 내용',
    example: '안녕하세요',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o: UpdateAboutDto) => !o.content_en)
  content_ko?: string;

  @ApiProperty({
    description: '영어 내용',
    example: 'Hello',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o: UpdateAboutDto) => !o.content_ko)
  content_en?: string;
}
