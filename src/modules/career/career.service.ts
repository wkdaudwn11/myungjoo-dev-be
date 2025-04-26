import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import {
  CreateCareerDto,
  CreateCareerProjectDto,
} from './dto/create-career.dto';
import { CareerProject } from './entities/career-project.entity';
import { Career } from './entities/career.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { CustomException } from '@/common/exceptions/custom.exception';

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
    @InjectRepository(CareerProject)
    private readonly careerProjectRepository: Repository<CareerProject>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCareerDto: CreateCareerDto): Promise<Career> {
    const exists = await this.careerRepository.findOne({
      where: { key: createCareerDto.key, lang: createCareerDto.lang },
    });
    if (exists) {
      throw new CustomException(
        `'${createCareerDto.key}/${createCareerDto.lang}' key already exists.`,
        ErrorCode.DUPLICATE_ERROR,
        { key: createCareerDto.key, lang: createCareerDto.lang },
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
      return savedCareer;
    });
  }
}
