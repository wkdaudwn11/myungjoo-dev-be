import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AboutResponseDto } from './dto/about-response.dto';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { About } from './entities/about.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';
import { validateLang } from '@/common/utils/validation.util';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
  ) {}

  async create(dto: CreateAboutDto): Promise<AboutResponseDto> {
    const found = await this.aboutRepository.findOneBy({
      tabKey: dto.tabKey,
      menuKey: dto.menuKey,
    });

    if (found) {
      throw new CustomException(
        `'${dto.tabKey}/${dto.menuKey}' key already exists.`,
        ErrorCode.DUPLICATE_ERROR,
      );
    }

    const created = this.aboutRepository.create({
      ...dto,
    });

    const saved = await this.aboutRepository.save(created);

    return {
      id: saved.id,
      tabKey: saved.tabKey,
      menuKey: saved.menuKey,
      content: saved.content_ko,
    };
  }

  async findByKeys(
    tabKey: string,
    menuKey: string,
    lang: LangType,
  ): Promise<AboutResponseDto> {
    validateLang(lang);

    const found = await this.aboutRepository.findOneBy({
      tabKey,
      menuKey,
    });

    if (!found) {
      throw new CustomException(
        `'${tabKey}/${menuKey}' not found.`,
        ErrorCode.NOTFOUND_ERROR,
      );
    }

    return {
      id: found.id,
      tabKey: found.tabKey,
      menuKey: found.menuKey,
      content: lang === LangType.Korean ? found.content_ko : found.content_en,
    };
  }

  async update(
    tabKey: string,
    menuKey: string,
    dto: UpdateAboutDto,
  ): Promise<AboutResponseDto> {
    if (!dto.content_ko && !dto.content_en) {
      throw new CustomException(
        'At least one of content_ko or content_en must be provided',
        ErrorCode.VALIDATION_ERROR,
        {
          fieldErrors: [
            {
              field: 'content',
              message:
                'At least one of content_ko or content_en must be provided',
            },
          ],
        },
      );
    }

    const found = await this.aboutRepository.findOneBy({
      tabKey,
      menuKey,
    });

    if (!found) {
      throw new CustomException(
        `'${tabKey}/${menuKey}' not found.`,
        ErrorCode.NOTFOUND_ERROR,
      );
    }

    const toUpdate = {
      ...found,
      ...(dto.content_ko && { content_ko: dto.content_ko }),
      ...(dto.content_en && { content_en: dto.content_en }),
    };

    const updated = await this.aboutRepository.save(toUpdate);

    return {
      ...updated,
    };
  }
}
