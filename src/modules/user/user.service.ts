import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import { CustomException } from '@/common/exceptions/custom.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new CustomException('email is already used', 'DUPLICATE_EMAIL', {
        fieldErrors: [
          {
            field: 'email',
            message: 'email is already used',
          },
        ],
      });
    }

    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }
}
