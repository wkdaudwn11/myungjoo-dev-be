import { ApiProperty } from '@nestjs/swagger';

export class AboutResponseDto {
  @ApiProperty({
    description: 'About 고유 ID',
    example: '27590e7f-259b-407e-b1dd-e89725901358',
  })
  id: string;

  @ApiProperty({
    description: 'tab key 값',
    example: 'professional',
  })
  tabKey: string;

  @ApiProperty({
    description: 'menu key 값',
    example: 'experience',
  })
  menuKey: string;

  @ApiProperty({
    description: '선택된 언어에 따른 내용',
    example: '내용',
  })
  content?: string;

  @ApiProperty({
    description: '한국어 내용',
    example: '내용',
  })
  content_ko?: string;

  @ApiProperty({
    description: '영어 내용',
    example: '내용',
  })
  content_en?: string;
}
