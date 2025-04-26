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
import { getNextOrder } from '@/common/utils/order.util';

@Injectable()
export class AboutCategoryService {
  constructor(
    @InjectRepository(AboutCategory)
    private readonly aboutCategoryRepository: Repository<AboutCategory>,
  ) {}

  private toResponseDto(
    entity: AboutCategory,
    lang?: LangType,
  ): AboutCategoryResponseDto {
    return {
      id: entity.id,
      type: entity.type,
      key: entity.key as MenuKey,
      name: lang ? entity.name[lang] : entity.name.ko,
      menus: entity.menus,
      displayOrder: entity.displayOrder,
    };
  }

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

    const displayOrder = dto.displayOrder
      ? dto.displayOrder
      : await getNextOrder(this.aboutCategoryRepository, 'displayOrder');

    const created = this.aboutCategoryRepository.create({
      ...dto,
      displayOrder,
    });

    const saved = await this.aboutCategoryRepository.save(created);

    return this.toResponseDto(saved);
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

    return all.map((item) => this.toResponseDto(item, lang));
  }

  async updateByKey(
    key: MenuKey,
    dto: UpdateAboutCategoryDto,
  ): Promise<AboutCategoryResponseDto> {
    const found = await this.aboutCategoryRepository.findOneBy({ key });

    if (!found) {
      throw new CustomException(
        `'${key}' does not exist.`,
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

    return this.toResponseDto(saved);
  }
}
