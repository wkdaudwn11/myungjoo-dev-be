import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

import { LangType } from '@/common/constants/lang-type.enum';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '프로젝트 등록',
    description: '새 프로젝트를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '등록 성공',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 400, description: '입력 값 검증 실패' })
  async create(@Body() dto: CreateProjectDto): Promise<ProjectResponseDto> {
    return this.projectService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '프로젝트 조회',
    description: '프로젝트를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  async findByLangAndTechStack(
    @Query('lang') lang: LangType,
    @Query('tech') tech: string | string[],
  ): Promise<ProjectResponseDto[]> {
    const techArr: string[] | undefined =
      typeof tech === 'string' ? tech.split(',') : tech;
    return this.projectService.findByLangAndTechStack(lang, techArr);
  }

  @Put(':key/:lang')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '프로젝트 수정',
    description: 'key, lang으로 프로젝트를 수정합니다.',
  })
  @ApiParam({ name: 'key', description: '프로젝트 고유 키' })
  @ApiParam({ name: 'lang', description: '언어 코드', enum: LangType })
  @ApiResponse({
    status: 200,
    description: '수정 성공',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  async updateByKeyAndLang(
    @Param('key') key: string,
    @Param('lang') lang: LangType,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.updateByKeyAndLang(key, lang, dto);
  }
}
