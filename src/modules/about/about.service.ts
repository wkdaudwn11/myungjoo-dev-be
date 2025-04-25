import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AboutResponseDto } from './dto/about-response.dto';
import { CreateAboutDto } from './dto/create-about.dto';
import { About } from './entities/about.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { CustomException } from '@/common/exceptions/custom.exception';

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
      ...saved,
      content: saved.content_ko,
    };
  }
}
