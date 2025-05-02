import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateHelloDto } from './dto/create-hello.dto';
import { HelloResponseDto } from './dto/hello-response.dto';
import { Hello } from './entities/hello.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';
import { validateLang } from '@/common/utils/validation.util';

@Injectable()
export class HelloService {
  constructor(
    @InjectRepository(Hello)
    private readonly helloRepository: Repository<Hello>,
  ) {}

  private toResponseDto(entity: Hello): HelloResponseDto {
    return {
      lang: entity.lang,
      text01: entity.text01,
      name: entity.name,
      text02: entity.text02,
      code: entity.code,
    };
  }

  async create(dto: CreateHelloDto): Promise<HelloResponseDto> {
    const found = await this.helloRepository.findOneBy({ lang: dto.lang });

    if (found) {
      throw new CustomException(
        `'${dto.lang}' lang already exists.`,
        ErrorCode.DUPLICATE_ERROR,
      );
    }

    const saved = await this.helloRepository.save(dto);
    return this.toResponseDto(saved);
  }

  async findByLang(lang: LangType): Promise<HelloResponseDto> {
    validateLang(lang);

    const found = await this.helloRepository.findOneBy({ lang });

    if (!found) {
      throw new CustomException(
        `No data found for language '${lang}'.`,
        ErrorCode.NOTFOUND_ERROR,
        {
          fieldErrors: [
            {
              param: 'lang',
              message: 'No existing data to retrieve for this language.',
            },
          ],
        },
        404,
      );
    }

    return this.toResponseDto(found);
  }

  async updateByLang(
    lang: LangType,
    dto: CreateHelloDto,
  ): Promise<HelloResponseDto> {
    if (dto.lang !== lang) {
      throw new CustomException(
        `Language in the body ('${dto.lang}') does not match path param ('${lang}').`,
        ErrorCode.VALIDATION_ERROR,
        {
          fieldErrors: [
            {
              param: 'lang',
              message: 'Language cannot be changed during update.',
            },
          ],
        },
        400,
      );
    }

    const found = await this.helloRepository.findOneBy({ lang });

    if (!found) {
      throw new CustomException(
        `No data found for language '${lang}'.`,
        ErrorCode.NOTFOUND_ERROR,
        {
          fieldErrors: [
            {
              param: 'lang',
              message: 'No existing data to update for this language.',
            },
          ],
        },
        404,
      );
    }

    const updated = this.helloRepository.merge(found, dto);
    const saved = await this.helloRepository.save(updated);

    return this.toResponseDto(saved);
  }
}
