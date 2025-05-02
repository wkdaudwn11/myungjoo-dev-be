import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

import { CareerResponseDto } from './dto/career-response.dto';
import {
  CreateCareerDto,
  CreateCareerProjectDto,
} from './dto/create-career.dto';
import {
  UpdateCareerDto,
  UpdateCareerProjectDto,
} from './dto/update-career.dto';
import { CareerProject } from './entities/career-project.entity';
import { Career } from './entities/career.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';
import { validateLang } from '@/common/utils/validation.util';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
    private readonly dataSource: DataSource,
  ) {}

  private toResponseDto(entity: Career): CareerResponseDto;
  private toResponseDto(entity: Career[]): CareerResponseDto[];
  private toResponseDto(
    entity: Career | Career[],
  ): CareerResponseDto | CareerResponseDto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) => this.toResponseDto(item));
    }
    return {
      id: entity.id,
      key: entity.key,
      lang: entity.lang,
      name: {
        ko: entity.lang === LangType.Korean ? entity.name : '',
        en: entity.lang === LangType.English ? entity.name : '',
      },
      slogan: entity.slogan,
      role: entity.role,
      logoUrl: entity.logoUrl,
      startDate: entity.startDate,
      endDate: entity.endDate,
      projects:
        entity.projects?.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
        })) || [],
    };
  }

  async create(createCareerDto: CreateCareerDto): Promise<CareerResponseDto> {
    const exists = await this.careerRepository.findOne({
      where: { key: createCareerDto.key, lang: createCareerDto.lang },
    });
    if (exists) {
      throw new CustomException(
        `'${createCareerDto.key}/${createCareerDto.lang}' key already exists.`,
        ErrorCode.DUPLICATE_ERROR,
        {
          fieldErrors: [
            {
              field: 'key',
              message: `'${createCareerDto.key}/${createCareerDto.lang}' key already exists.`,
            },
            {
              field: 'lang',
              message: `'${createCareerDto.key}/${createCareerDto.lang}' key already exists.`,
            },
          ],
        },
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      const { projects, ...careerData } = createCareerDto;
      const career = manager.create(Career, careerData);
      const savedCareer = await manager.save(Career, career);

      if (projects && projects.length > 0) {
        const projectEntities = projects.map(
          (project: CreateCareerProjectDto) =>
            manager.create(CareerProject, {
              ...project,
              career: savedCareer,
              careerId: savedCareer.id,
            }),
        );
        await manager.save(CareerProject, projectEntities);
        savedCareer.projects = projectEntities;
      } else {
        savedCareer.projects = [];
      }
      return this.toResponseDto(savedCareer);
    });
  }

  async findByLang(
    lang: LangType,
    key: string[] = [],
  ): Promise<CareerResponseDto[]> {
    validateLang(lang);

    if (!key || key.length === 0) {
      return [];
    }

    const isAll = key.includes('all');
    const keyFilter = isAll ? {} : { key: In(key) };

    const [targetLangCareers, allLangCareers] = await Promise.all([
      this.careerRepository.find({
        where: { lang, ...keyFilter },
        relations: ['projects'],
        order: { startDate: 'DESC' },
      }),
      this.careerRepository.find({
        where: keyFilter,
        relations: ['projects'],
        order: { startDate: 'DESC' },
      }),
    ]);

    if (!targetLangCareers.length) {
      throw new CustomException(
        `No data found for lang '${lang}'.`,
        ErrorCode.NOTFOUND_ERROR,
        { lang },
      );
    }

    const namesByKey: Record<string, { ko: string; en: string }> = {};

    for (const item of allLangCareers) {
      const { key, lang, name } = item;
      if (!namesByKey[key]) namesByKey[key] = { ko: '', en: '' };

      namesByKey[key][lang] = name;
    }

    return targetLangCareers.map((item) => ({
      ...this.toResponseDto(item),
      name: namesByKey[item.key],
    }));
  }

  async updateByKeyAndLang(
    key: string,
    lang: LangType,
    dto: UpdateCareerDto,
  ): Promise<CareerResponseDto> {
    const found = await this.careerRepository.findOne({
      where: { key, lang },
      relations: ['projects'],
    });
    if (!found) {
      throw new CustomException(
        `Career with key '${key}' and lang '${lang}' does not exist.`,
        ErrorCode.NOTFOUND_ERROR,
        { key, lang },
      );
    }
    return await this.dataSource.transaction(async (manager) => {
      const { projects, ...careerData } = dto;
      manager.merge(Career, found, careerData);

      const updatedCareer = await manager.save(Career, found);

      if (projects) {
        await manager.delete(CareerProject, { careerId: found.id });
        const projectEntities = projects.map(
          (project: UpdateCareerProjectDto) =>
            manager.create(CareerProject, {
              ...project,
              career: updatedCareer,
              careerId: updatedCareer.id,
            }),
        );
        await manager.save(CareerProject, projectEntities);
        updatedCareer.projects = projectEntities;
      }
      return this.toResponseDto(updatedCareer);
    });
  }
}
