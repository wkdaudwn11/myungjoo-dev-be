/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';

import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { CareerResponseDto } from './dto/career-response.dto';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

import { LangType } from '@/common/constants/lang-type.enum';

const mockCareerResponse: CareerResponseDto = {
  id: 'uuid-career',
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
      id: 'uuid-project-1',
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
              if (!dto.key || !dto.lang) {
                return Promise.reject(new Error('key, lang is required'));
              }
              return Promise.resolve(mockCareerResponse);
            }),
            findOneByLang: jest.fn().mockResolvedValue(mockCareerResponse),
            updateByKeyAndLang: jest.fn().mockResolvedValue(mockCareerResponse),
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
    expect(result).toEqual(mockCareerResponse);
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

  it('경력 단일 조회 성공', async () => {
    const result = await controller.findOneByLang('ko' as LangType);
    expect(result).toEqual(mockCareerResponse);
    expect(service.findOneByLang).toHaveBeenCalledWith('ko');
  });

  it('경력 수정 성공', async () => {
    const dto: UpdateCareerDto = {
      name: '수정된 이름',
    };
    const result = await controller.updateByKeyAndLang(
      'supertree',
      'ko' as LangType,
      dto,
    );
    expect(result).toEqual(mockCareerResponse);
    expect(service.updateByKeyAndLang).toHaveBeenCalledWith(
      'supertree',
      'ko',
      dto,
    );
  });

  it('경력 수정 실패 - 존재하지 않는 필드', async () => {
    const dto: any = {
      name: '수정된 이름',
      test: '존재하지 않는 필드',
    };
    await expect(
      controller.updateByKeyAndLang('supertree', 'ko' as LangType, dto),
    ).resolves.toBeDefined();
    expect(service.updateByKeyAndLang).toHaveBeenCalledWith(
      'supertree',
      'ko',
      dto,
    );
  });

  it('경력 수정 실패 - 타입 미스매치', async () => {
    const dto: any = {
      name: { json: '잘못된 타입' },
    };
    await expect(
      controller.updateByKeyAndLang('supertree', 'ko' as LangType, dto),
    ).resolves.toBeDefined();
    expect(service.updateByKeyAndLang).toHaveBeenCalledWith(
      'supertree',
      'ko',
      dto,
    );
  });
});
