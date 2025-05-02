import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { Project } from './entities/project.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';
import { getNextOrder } from '@/common/utils/order.util';
import { validateLang } from '@/common/utils/validation.util';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  private toResponseDto(entity: Project): ProjectResponseDto;
  private toResponseDto(entity: Project[]): ProjectResponseDto[];
  private toResponseDto(
    entity: Project | Project[],
  ): ProjectResponseDto | ProjectResponseDto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) => ({
        id: item.id,
        key: item.key,
        lang: item.lang,
        title: item.title,
        language: item.language,
        tech_stack: item.tech_stack,
        thumbnail_url: item.thumbnail_url,
        description: item.description,
        github_url: item.github_url,
        site_url: item.site_url,
        displayOrder: item.displayOrder,
        startDate: item.startDate,
        endDate: item.endDate,
      }));
    }
    return {
      id: entity.id,
      key: entity.key,
      lang: entity.lang,
      title: entity.title,
      language: entity.language,
      tech_stack: entity.tech_stack,
      thumbnail_url: entity.thumbnail_url,
      description: entity.description,
      github_url: entity.github_url,
      site_url: entity.site_url,
      displayOrder: entity.displayOrder,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };
  }

  async create(dto: CreateProjectDto): Promise<ProjectResponseDto> {
    const exists = await this.projectRepository.findOne({
      where: { key: dto.key, lang: dto.lang },
    });
    if (exists) {
      throw new CustomException(
        `'${dto.key}/${dto.lang}' key already exists.`,
        ErrorCode.DUPLICATE_ERROR,
        {
          fieldErrors: [
            {
              field: 'key',
              message: `'${dto.key}/${dto.lang}' key already exists.`,
            },
            {
              field: 'lang',
              message: `'${dto.key}/${dto.lang}' key already exists.`,
            },
          ],
        },
      );
    }
    const displayOrder = dto.displayOrder
      ? dto.displayOrder
      : await getNextOrder(this.projectRepository, 'displayOrder');

    const entity = this.projectRepository.create({
      ...dto,
      displayOrder,
    });
    const saved = await this.projectRepository.save(entity);
    return this.toResponseDto(saved);
  }

  async findByLangAndTechStack(
    lang: LangType,
    tech: string[],
  ): Promise<ProjectResponseDto[]> {
    validateLang(lang);

    if (!tech || tech.length === 0) return [];

    if (tech.length === 1 && tech[0] === 'all') {
      const found = await this.projectRepository.find({
        where: { lang },
      });
      return this.toResponseDto(found);
    }

    const query = this.projectRepository
      .createQueryBuilder('project')
      .where('project.lang = :lang', { lang });

    tech.forEach((t, index) => {
      query.andWhere(`project.tech_stack LIKE :tech${index}`, {
        [`tech${index}`]: `%${t}%`,
      });
    });

    const found = await query.getMany();
    return this.toResponseDto(found);
  }

  async updateByKeyAndLang(
    key: string,
    lang: string,
    dto: Partial<Project>,
  ): Promise<ProjectResponseDto> {
    const langEnum = lang as LangType;
    const found = await this.projectRepository.findOne({
      where: { key, lang: langEnum },
    });
    if (!found) {
      throw new CustomException(
        `Project with key '${key}' and lang '${lang}' does not exist.`,
        ErrorCode.NOTFOUND_ERROR,
        {
          fieldErrors: [
            {
              field: 'key',
              message: `Project with key '${key}' and lang '${lang}' does not exist.`,
            },
            {
              field: 'lang',
              message: `Project with key '${key}' and lang '${lang}' does not exist.`,
            },
          ],
        },
        404,
      );
    }
    const merged = this.projectRepository.merge(found, dto);
    const saved = await this.projectRepository.save(merged);
    return this.toResponseDto(saved);
  }
}
