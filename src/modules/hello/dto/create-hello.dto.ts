import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, IsEnum } from 'class-validator';

import { LangType } from '@/common/constants/lang-type.enum';

class CodeDto {
  @ApiProperty({
    description: '코드 블럭 제목 텍스트',
    example: 'GitHub에서 제 프로젝트를 확인해보세요',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '깃허브 관련 텍스트',
    example: '이력서보다 깃허브가 더 솔직하니까요',
  })
  @IsNotEmpty()
  @IsString()
  github_text: string;

  @ApiProperty({
    description: '이메일 안내 텍스트',
    example: '뭔가 더 궁금하다면, 부담 없이',
  })
  @IsNotEmpty()
  @IsString()
  email_text: string;

  @ApiProperty({ description: '이메일 버튼 텍스트', example: '이메일 보내기' })
  @IsNotEmpty()
  @IsString()
  email_button_text: string;

  @ApiProperty({
    description: '코드 하단 텍스트 01',
    example: 'React 기반의 인터랙티브한 UI와 사용자 중심 UX를 지향합니다.',
  })
  @IsNotEmpty()
  @IsString()
  text01: string;

  @ApiProperty({
    description: '코드 하단 텍스트 02',
    example: '작지만 명확한 경험을 설계합니다.',
  })
  @IsNotEmpty()
  @IsString()
  text02: string;
}

export class CreateHelloDto {
  @ApiProperty({
    example: 'ko',
    description: '언어 코드',
    enum: LangType,
  })
  @IsNotEmpty()
  @IsEnum(LangType)
  lang: LangType;

  @ApiProperty({ example: '안녕하세요. 저는', description: '첫 줄 텍스트' })
  @IsNotEmpty()
  @IsString()
  text01: string;

  @ApiProperty({
    example: '프론트엔드 개발자',
    description: '두 번째 줄 텍스트',
  })
  @IsNotEmpty()
  @IsString()
  text02: string;

  @ApiProperty({ example: '장명주', description: '이름 텍스트' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '코드 블럭에 들어가는 텍스트 정보',
    type: CodeDto,
  })
  @IsNotEmpty()
  @IsObject()
  code: CodeDto;
}
