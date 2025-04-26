import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { CustomException } from '@/common/exceptions/custom.exception';

export interface UserResponseDto {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private toResponseDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
    };
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new CustomException(
        'email is already used',
        ErrorCode.DUPLICATE_ERROR,
        {
          fieldErrors: [
            {
              field: 'email',
              message: 'email is already used',
            },
          ],
        },
      );
    }

    const user = this.userRepo.create(dto);
    const saved = await this.userRepo.save(user);
    return this.toResponseDto(saved);
  }
}
