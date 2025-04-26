/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';

import { LangType } from '@/common/constants/lang-type.enum';

const mockCareer = {
  key: 'supertree' as string,
  lang: 'ko' as LangType,
  name: '㈜ 수퍼트리',
  slogan:
    'PlayDapp 생태계 내에서 블록체인 기반 프론트엔드 플랫폼(마켓, 포털, 미니앱 등) 개발',
  role: 'Frontend Developer (React, Next.js)',
  logoUrl: '/images/supertree.svg',
  startDate: '2021-06-01',
  endDate: '2024-12-31',
  projects: [
    {
      title: 'EzPlay 리뉴얼 및 텔레그램 미니앱 연동',
      description:
        '기존 EzPlay를 포크하여 디자인을 개선하고 텔레그램 로그인 및 미니앱을 추가하여 새로운 도메인으로 재런칭',
    },
  ],
};

describe('CareerController', () => {
  let controller: CareerController;
  let service: CareerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareerController],
      providers: [
        {
          provide: CareerService,
          useValue: {
            create: jest.fn((dto) => {
              if (!dto.key || !dto.lang)
                throw new Error('key, lang is required');
              return Promise.resolve(dto);
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<CareerController>(CareerController);
    service = module.get<CareerService>(CareerService);
  });

  it('경력 등록 성공', async () => {
    const dto: CreateCareerDto = {
      key: 'supertree',
      lang: 'ko' as LangType,
      name: '㈜ 수퍼트리',
      slogan:
        'PlayDapp 생태계 내에서 블록체인 기반 프론트엔드 플랫폼(마켓, 포털, 미니앱 등) 개발',
      role: 'Frontend Developer (React, Next.js)',
      logoUrl: '/images/supertree.svg',
      startDate: '2021-06-01',
      endDate: '2024-12-31',
      projects: [
        {
          title: 'EzPlay 리뉴얼 및 텔레그램 미니앱 연동',
          description:
            '기존 EzPlay를 포크하여 디자인을 개선하고 텔레그램 로그인 및 미니앱을 추가하여 새로운 도메인으로 재런칭',
        },
      ],
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockCareer);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('경력 등록 실패 - 필수값 누락', async () => {
    const dto: any = {
      lang: 'ko',
      name: '㈜ 수퍼트리',
      slogan:
        'PlayDapp 생태계 내에서 블록체인 기반 프론트엔드 플랫폼(마켓, 포털, 미니앱 등) 개발',
      role: 'Frontend Developer (React, Next.js)',
      logoUrl: '/images/supertree.svg',
      startDate: '2021-06-01',
      endDate: '2024-12-31',
      projects: [],
    };
    await expect(controller.create(dto)).rejects.toThrow();
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
