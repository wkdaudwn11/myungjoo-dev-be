import { Test, TestingModule } from '@nestjs/testing';

import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AboutResponseDto } from './dto/about-response.dto';
import { CreateAboutDto } from './dto/create-about.dto';

describe('AboutController', () => {
  let aboutController: AboutController;

  const mockService = {
    create: jest.fn().mockResolvedValue(new AboutResponseDto()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutController],
      providers: [{ provide: AboutService, useValue: mockService }],
    }).compile();

    aboutController = module.get<AboutController>(AboutController);
  });

  it('AboutController가 정의되어야 함', () => {
    expect(aboutController).toBeDefined();
  });

  describe('create', () => {
    it('About 항목을 생성해야 함', async () => {
      const dto: CreateAboutDto = {
        tabKey: 'professional',
        menuKey: 'experience',
        content_ko: 'content_ko',
        content_en: 'content_en',
      };

      const expected: AboutResponseDto = {
        tabKey: 'professional',
        menuKey: 'experience',
        content: 'content_ko',
      };

      mockService.create.mockResolvedValueOnce(expected);

      const result = await aboutController.create(dto);
      expect(result).toEqual(expected);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });
});
