import { ApiProperty } from '@nestjs/swagger';

export class AboutResponseDto {
  @ApiProperty({
    description: 'tab key 값',
    example: 'experience',
  })
  tabKey: string;

  @ApiProperty({
    description: 'menu key 값',
    example: 'experience',
  })
  menuKey: string;

  @ApiProperty({
    description: '내용',
    example: '내용',
  })
  content: string;
}
