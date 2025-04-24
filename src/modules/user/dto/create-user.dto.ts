import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@email.com',
    description: '이메일',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '장명주',
    description: '이름',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
