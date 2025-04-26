import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { LangType } from '@/common/constants/lang-type.enum';

@Entity({ name: 'project' })
@Unique(['key', 'lang'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  key: string;

  @Column({ type: 'enum', enum: LangType })
  lang: LangType;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  language: string;

  @Column({ type: 'simple-array' })
  tech_stack: string[];

  @Column({ type: 'varchar', length: 300, nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  github_url?: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  site_url?: string;

  @Column({ type: 'int', nullable: true })
  displayOrder?: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string | null;
}
