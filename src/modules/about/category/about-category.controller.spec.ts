import { Test, TestingModule } from '@nestjs/testing';

import { AboutCategoryController } from './about-category.controller';
import { AboutCategoryService } from './about-category.service';
import { CreateAboutCategoryDto } from './dto/create-about-category.dto';
import { UpdateAboutCategoryDto } from './dto/update-about-category.dto';

import { AboutCategoryType, MenuKey } from '@/common/constants/about.enum';
import { LangType } from '@/common/constants/lang-type.enum';

describe('AboutCategoryController', () => {
  let controller: AboutCategoryController;

  const KEY = 'professional';

  const mockResponse = {
    id: 'uuid-1234',
    type: AboutCategoryType.TAB,
    key: KEY,
    name: '직무 경험',
    menus: [MenuKey.EXPERIENCE, MenuKey.HARD_SKILLS, MenuKey.SOFT_SKILLS],
    displayOrder: 1,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockResponse),
    findAllByLang: jest.fn().mockResolvedValue([mockResponse]),
    updateByKey: jest.fn().mockResolvedValue(mockResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutCategoryController],
      providers: [{ provide: AboutCategoryService, useValue: mockService }],
    }).compile();

    controller = module.get<AboutCategoryController>(AboutCategoryController);
  });

  it('AboutCategoryController가 정의되어야 함', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('새 카테고리를 등록해야 함', async () => {
      const dto: CreateAboutCategoryDto = {
        type: AboutCategoryType.TAB,
        key: KEY,
        name: { ko: '직무 경험', en: 'experience' },
        menus: [MenuKey.EXPERIENCE, MenuKey.HARD_SKILLS, MenuKey.SOFT_SKILLS],
      };
      const result = await controller.create(dto);
      expect(result).toEqual(mockResponse);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllByLang()', () => {
    it('언어 기준으로 카테고리 목록을 조회해야 함', async () => {
      const lang = 'ko';
      const result = await controller.findAllByLang(lang as LangType);
      expect(result).toEqual([mockResponse]);
      expect(mockService.findAllByLang).toHaveBeenCalledWith(lang);
    });
  });

  describe('update()', () => {
    it('기존 카테고리를 수정해야 함', async () => {
      const dto: UpdateAboutCategoryDto = {
        type: AboutCategoryType.TAB,
        name: { ko: '직무 경험', en: 'experience' },
        menus: [MenuKey.HARD_SKILLS, MenuKey.SOFT_SKILLS],
        displayOrder: 1,
      };
      const result = await controller.update(MenuKey.EXPERIENCE, dto);
      expect(result).toEqual(mockResponse);
      expect(mockService.updateByKey).toHaveBeenCalledWith(
        MenuKey.EXPERIENCE,
        dto,
      );
    });
  });
});
