import { Test, TestingModule } from '@nestjs/testing';

import { CreateHelloDto } from './dto/create-hello.dto';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

import { LangType } from '@/common/constants/lang-type.enum';

describe('HelloController', () => {
  let controller: HelloController;

  const mockHello = {
    id: 'uuid-1234',
    lang: 'ko' as LangType,
    text01: '안녕하세요. 저는',
    name: '장명주',
    text02: '프론트엔드 개발자',
    code: {
      title: 'GitHub에서 제 프로젝트를 확인해보세요',
      github_text: '이력서보다 깃허브가 더 솔직하니까요',
      email_text: '뭔가 더 궁금하다면, 부담 없이',
      email_button_text: '이메일 보내기',
      text01: 'React 기반의 인터랙티브한 UI와 사용자 중심 UX를 지향합니다.',
      text02: '작지만 명확한 경험을 설계합니다.',
    },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockHello),
    updateByLang: jest.fn().mockResolvedValue(mockHello),
    findByLang: jest.fn().mockResolvedValue(mockHello),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [{ provide: HelloService, useValue: mockService }],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('HelloController가 정의되어야 함', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('새로운 Hello 데이터를 등록해야 함', async () => {
      const dto: CreateHelloDto = { ...mockHello };
      const result = await controller.create(dto);
      expect(result).toEqual(mockHello);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update()', () => {
    it('기존 Hello 데이터를 수정해야 함', async () => {
      const dto: CreateHelloDto = { ...mockHello };
      const result = await controller.update('ko' as LangType, dto);
      expect(result).toEqual(mockHello);
      expect(mockService.updateByLang).toHaveBeenCalledWith('ko', dto);
    });
  });

  describe('findByLang()', () => {
    it('lang에 해당하는 Hello 데이터를 반환해야 함', async () => {
      const result = await controller.findByLang('ko' as LangType);
      expect(result).toEqual(mockHello);
      expect(mockService.findByLang).toHaveBeenCalledWith('ko');
    });
  });
});
