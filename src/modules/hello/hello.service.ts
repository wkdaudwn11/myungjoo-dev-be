import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateHelloDto } from './dto/create-hello.dto';
import { HelloResponseDto } from './dto/hello-response.dto';
import { Hello } from './entities/hello.entity';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';

const SUPPORTED_LANGUAGES = Object.values(LangType);

@Injectable()
export class HelloService {
  constructor(
    @InjectRepository(Hello)
    private readonly helloRepository: Repository<Hello>,
  ) {}

  async create(dto: CreateHelloDto): Promise<HelloResponseDto> {
    if (!SUPPORTED_LANGUAGES.includes(dto.lang)) {
      throw new CustomException(
        `'${dto.lang}' is not a supported language.`,
        ErrorCode.NOTFOUND_ERROR,
        {
          fieldErrors: [
            {
              param: 'lang',
              message: 'Supported languages are: ko, en',
            },
          ],
        },
        400,
      );
    }

    const found = await this.helloRepository.findOneBy({ lang: dto.lang });

    if (found) {
      throw new CustomException(
        `Data for language '${dto.lang}' already exists.`,
        ErrorCode.DUPLICATE_ERROR,
      );
    }

    const saved = await this.helloRepository.save(dto);
    return saved;
  }

  async findByLang(lang: LangType): Promise<HelloResponseDto> {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      throw new CustomException(
        `'${lang}' is not a supported language.`,
        ErrorCode.NOTFOUND_ERROR,
        {
          fieldErrors: [
            {
              param: 'lang',
              message: 'Supported languages are: ko, en',
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
              message: 'No existing data to retrieve for this language.',
            },
          ],
        },
        404,
      );
    }

    return found;
  }

  async updateByLang(
    lang: LangType,
    dto: CreateHelloDto,
  ): Promise<HelloResponseDto> {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      throw new CustomException(
        `'${lang}' is not a supported language.`,
        ErrorCode.NOTFOUND_ERROR,
        {
          fieldErrors: [
            {
              param: 'lang',
              message: 'Supported languages are: ko, en',
            },
          ],
        },
        400,
      );
    }

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

    return saved;
  }
}
