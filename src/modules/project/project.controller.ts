import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectService } from './project.service';

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
}
