import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: '테스트 유저',
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('유저 생성 요청 시 UserService를 호출해야 함', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      name: '테스트 유저',
    };

    const result = await controller.create(dto);

    expect(jest.spyOn(service, 'create')).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockUser);
  });
});
