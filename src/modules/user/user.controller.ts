import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return dto;
  }
}
