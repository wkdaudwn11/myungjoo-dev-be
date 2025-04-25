/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';

describe('AboutController', () => {
  let controller: AboutController;
  let service: AboutService;

  const mockAboutService = {
    create: jest.fn(),
    findByKeys: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutController],
      providers: [
        {
          provide: AboutService,
          useValue: mockAboutService,
        },
      ],
    }).compile();

    controller = module.get<AboutController>(AboutController);
    service = module.get<AboutService>(AboutService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 합니다', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createAboutDto: CreateAboutDto = {
      tabKey: 'test',
      menuKey: 'test',
      content_ko: '테스트',
      content_en: 'test',
    };

    const expectedResponse = {
      id: 'test-id',
      tabKey: 'test',
      menuKey: 'test',
      content: '테스트',
    };

    it('About 컨텐츠를 성공적으로 생성해야 합니다', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(expectedResponse);

      const result = await controller.create(createAboutDto);

      expect(result).toEqual(expectedResponse);
      expect(service.create).toHaveBeenCalledWith(createAboutDto);
    });
  });

  describe('findByKeys', () => {
    const expectedResponse = {
      id: 'test-id',
      tabKey: 'test',
      menuKey: 'test',
      content: '테스트',
    };

    it('키 값으로 About 컨텐츠를 성공적으로 조회해야 합니다', async () => {
      jest.spyOn(service, 'findByKeys').mockResolvedValue(expectedResponse);

      const result = await controller.findByKeys(
        'test',
        'test',
        LangType.Korean,
      );

      expect(result).toEqual(expectedResponse);
      expect(service.findByKeys).toHaveBeenCalledWith(
        'test',
        'test',
        LangType.Korean,
      );
    });

    it('컨텐츠가 없을 경우 에러가 발생해야 합니다', async () => {
      jest
        .spyOn(service, 'findByKeys')
        .mockRejectedValue(new CustomException('not found', 'NOTFOUND_ERROR'));

      await expect(
        controller.findByKeys('invalid', 'invalid', LangType.Korean),
      ).rejects.toThrow(CustomException);
    });
  });

  describe('update', () => {
    const updateAboutDto: UpdateAboutDto = {
      content_ko: '수정된 테스트',
    };

    const expectedResponse = {
      id: 'test-id',
      tabKey: 'test',
      menuKey: 'test',
      content: '수정된 테스트',
    };

    it('About 컨텐츠를 성공적으로 수정해야 합니다', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(expectedResponse);

      const result = await controller.update('test', 'test', updateAboutDto);

      expect(result).toEqual(expectedResponse);
      expect(service.update).toHaveBeenCalledWith(
        'test',
        'test',
        updateAboutDto,
      );
    });

    it('컨텐츠가 없을 경우 에러가 발생해야 합니다', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new CustomException('not found', 'NOTFOUND_ERROR'));

      await expect(
        controller.update('invalid', 'invalid', updateAboutDto),
      ).rejects.toThrow(CustomException);
    });

    it('컨텐츠가 제공되지 않았을 경우 에러가 발생해야 합니다', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new CustomException(
            'At least one of content_ko or content_en must be provided',
            'VALIDATION_ERROR',
          ),
        );

      await expect(
        controller.update('test', 'test', {} as UpdateAboutDto),
      ).rejects.toThrow(CustomException);
    });
  });
});
