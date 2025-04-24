import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { LangType } from '@/common/constants/lang-type.enum';

class HelloCodeDto {
  @ApiProperty({ description: '코드 블럭 제목 텍스트' })
  title: string;

  @ApiProperty({ description: '깃허브 관련 텍스트' })
  github_text: string;

  @ApiProperty({ description: '이메일 안내 텍스트' })
  email_text: string;

  @ApiProperty({ description: '이메일 버튼 텍스트' })
  email_button_text: string;

  @ApiProperty({ description: '코드 하단 텍스트 01' })
  text01: string;

  @ApiProperty({ description: '코드 하단 텍스트 02' })
  text02: string;
}

export class HelloResponseDto {
  @ApiProperty({ description: '언어 코드 (예: ko, en)' })
  @IsEnum(LangType)
  lang: LangType;

  @ApiProperty({ description: '첫 줄 텍스트' })
  text01: string;

  @ApiProperty({ description: '이름 텍스트' })
  name: string;

  @ApiProperty({ description: '두 번째 줄 텍스트' })
  text02: string;

  @ApiProperty({ description: '코드 블럭에 들어가는 텍스트 정보' })
  code: HelloCodeDto;
}
