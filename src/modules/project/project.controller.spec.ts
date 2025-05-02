/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';

import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

import { LangType } from '@/common/constants/lang-type.enum';

const mockProjectResponse: ProjectResponseDto = {
  id: 'uuid-project',
  key: 'myungjoo.dev',
  lang: LangType.Korean,
  title: 'myungjoo.dev',
  language: 'react',
  tech_stack: ['react', 'typescript'],
  thumbnail_url: '/images/thumbnail.png',
  description: '저에 대한 소개를 하는 사이트입니다.',
  github_url: 'https://github.com/myungjoo-dev',
  site_url: 'https://myungjoo.dev',
  displayOrder: 1,
  startDate: '2023-01-01',
  endDate: '2023-06-30',
};

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            create: jest.fn((dto: CreateProjectDto) => {
              if (!dto.key || !dto.lang) {
                return Promise.reject(new Error('key, lang is required'));
              }
              return Promise.resolve(mockProjectResponse);
            }),
            findByLangAndTechStack: jest.fn(),
            updateByKeyAndLang: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
  });

  it('프로젝트 등록 성공', async () => {
    const dto: CreateProjectDto = {
      key: 'myungjoo.dev',
      lang: LangType.Korean,
      title: 'myungjoo.dev',
      language: 'react',
      tech_stack: ['react', 'typescript'],
      thumbnail_url: '/images/thumbnail.png',
      description: '저에 대한 소개를 하는 사이트입니다.',
      github_url: 'https://github.com/myungjoo-dev',
      site_url: 'https://myungjoo.dev',
      displayOrder: 1,
      startDate: '2023-01-01',
      endDate: '2023-06-30',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockProjectResponse);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('프로젝트 등록 실패 - 필수값 누락', async () => {
    const dto = {
      lang: LangType.Korean,
      title: 'myungjoo.dev',
      language: 'react',
      tech_stack: ['react', 'typescript'],
      thumbnail_url: '/images/thumbnail.png',
      description: '저에 대한 소개를 하는 사이트입니다.',
      github_url: 'https://github.com/myungjoo-dev',
      site_url: 'https://myungjoo.dev',
      displayOrder: 1,
      startDate: '2023-01-01',
      endDate: '2023-06-30',
    } as Partial<CreateProjectDto>;
    await expect(controller.create(dto as CreateProjectDto)).rejects.toThrow();
    expect(service.create).toHaveBeenCalledWith(dto as CreateProjectDto);
  });

  it('프로젝트 조회 성공', async () => {
    jest
      .spyOn(service, 'findByLangAndTechStack')
      .mockResolvedValue([mockProjectResponse]);
    const result = await controller.findByLangAndTechStack(LangType.Korean, [
      'react',
      'typescript',
    ]);
    expect(result).toEqual([mockProjectResponse]);
    expect(service.findByLangAndTechStack).toHaveBeenCalledWith(
      LangType.Korean,
      ['react', 'typescript'],
    );
  });

  it('프로젝트 수정 성공', async () => {
    jest
      .spyOn(service, 'updateByKeyAndLang')
      .mockResolvedValue(mockProjectResponse);
    const dto = { title: '수정된 제목' };
    const result = await controller.updateByKeyAndLang(
      'myungjoo.dev',
      LangType.Korean,
      dto,
    );
    expect(result).toEqual(mockProjectResponse);
    expect(service.updateByKeyAndLang).toHaveBeenCalledWith(
      'myungjoo.dev',
      LangType.Korean,
      dto,
    );
  });
});
