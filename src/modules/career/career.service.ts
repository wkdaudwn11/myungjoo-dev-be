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
      name: entity.name,
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
    key: string[],
  ): Promise<CareerResponseDto[]> {
    const found = await this.careerRepository.find({
      where: { lang, key: key ? In(key) : undefined },
      relations: ['projects'],
      order: { startDate: 'DESC' },
    });
    if (!found || found.length === 0) {
      throw new CustomException(
        `lang '${lang}' does not exist.`,
        ErrorCode.NOTFOUND_ERROR,
        { lang },
      );
    }
    return this.toResponseDto(found);
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
