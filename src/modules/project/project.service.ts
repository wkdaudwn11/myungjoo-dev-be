import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { Project } from './entities/project.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { CustomException } from '@/common/exceptions/custom.exception';
import { getNextOrder } from '@/common/utils/order.util';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  private toResponseDto(entity: Project): ProjectResponseDto {
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
}
