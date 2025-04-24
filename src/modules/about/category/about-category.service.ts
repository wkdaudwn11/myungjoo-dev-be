import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AboutCategoryResponseDto } from './dto/about-category-response.dto';
import { CreateAboutCategoryDto } from './dto/create-about-category.dto';
import { UpdateAboutCategoryDto } from './dto/update-about-category.dto';
import { AboutCategory } from './entities/about-category.entity';

import { AboutCategoryType, MenuKey } from '@/common/constants/about.enum';
import { ErrorCode } from '@/common/constants/error-code.enum';
import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';

@Injectable()
export class AboutCategoryService {
  constructor(
    @InjectRepository(AboutCategory)
    private readonly aboutCategoryRepository: Repository<AboutCategory>,
  ) {}

  async create(dto: CreateAboutCategoryDto): Promise<AboutCategoryResponseDto> {
    const found = await this.aboutCategoryRepository.findOneBy({
      key: dto.key,
    });

    if (found) {
      throw new CustomException(
        `'${dto.key}' key already exists.`,
        ErrorCode.DUPLICATE_ERROR,
      );
    }

    if (dto.type === AboutCategoryType.MENU && dto.menus) {
      throw new CustomException(
        `MENU type must not have 'menus' field.`,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    let displayOrder = dto.displayOrder;

    if (displayOrder === undefined) {
      const maxOrder = await this.aboutCategoryRepository
        .createQueryBuilder('category')
        .select('MAX(category.displayOrder)', 'max')
        .getRawOne<{ max: number }>();
      displayOrder = (maxOrder?.max ?? 0) + 1;
    }

    const created = this.aboutCategoryRepository.create({
      ...dto,
      displayOrder,
    });

    const saved = await this.aboutCategoryRepository.save(created);

    return {
      ...saved,
      key: saved.key as MenuKey,
      name: JSON.stringify(saved.name),
    };
  }

  async findAllByLang(lang: LangType): Promise<AboutCategoryResponseDto[]> {
    if (!Object.values(LangType).includes(lang)) {
      throw new CustomException(
        `'${lang}' is not a supported language.`,
        ErrorCode.VALIDATION_ERROR,
        {
          fieldErrors: [
            {
              field: 'lang',
              message: 'Supported languages: ko, en',
            },
          ],
        },
        400,
      );
    }

    const all = await this.aboutCategoryRepository.find({
      order: { displayOrder: 'ASC' },
    });

    return all.map((item) => ({
      id: item.id,
      type: item.type,
      key: item.key as MenuKey,
      name: item.name[lang],
      menus: item.menus,
      displayOrder: item.displayOrder,
    }));
  }

  async updateByKey(
    key: MenuKey,
    dto: UpdateAboutCategoryDto,
  ): Promise<AboutCategoryResponseDto> {
    const found = await this.aboutCategoryRepository.findOneBy({ key });

    if (!found) {
      throw new CustomException(
        `Category with key '${key}' does not exist.`,
        ErrorCode.NOTFOUND_ERROR,
        {
          fieldErrors: [
            {
              param: 'key',
              message: 'No category found to update for the given key.',
            },
          ],
        },
        404,
      );
    }

    if (dto.type !== found.type) {
      throw new CustomException(
        'Cannot update the `type` field.',
        ErrorCode.VALIDATION_ERROR,
        {
          fieldErrors: [
            {
              param: 'type',
              message: 'Cannot update the `type` field.',
            },
          ],
        },
        400,
      );
    }

    const updated = this.aboutCategoryRepository.merge(found, dto);
    const saved = await this.aboutCategoryRepository.save(updated);

    return {
      ...saved,
      type: found.type,
      key: found.key as MenuKey,
      name: JSON.stringify(saved.name),
    };
  }
}
