import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Throttle({ medium: { limit: 20, ttl: 10000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '유저 등록',
    description: '유저 등록',
  })
  @ApiResponse({ status: 201, description: '유저 등록 성공' })
  @ApiResponse({ status: 400, description: '요청 형식 오류 또는 중복 이메일' })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }
}
