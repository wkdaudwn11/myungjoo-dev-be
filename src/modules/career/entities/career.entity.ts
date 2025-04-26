import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

import { CareerProject } from './career-project.entity';

import { LangType } from '@/common/constants/lang-type.enum';

@Entity({ name: 'career' })
@Unique(['key', 'lang'])
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column({ type: 'enum', enum: LangType })
  lang: LangType;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  slogan: string;

  @Column({ type: 'varchar', length: 100 })
  role: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  logoUrl: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @OneToMany(() => CareerProject, (project) => project.career, {
    cascade: true,
  })
  projects: CareerProject[];
}
