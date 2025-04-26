import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Career } from './career.entity';

@Entity({ name: 'career_project' })
export class CareerProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ManyToOne(() => Career, (career) => career.projects, { onDelete: 'CASCADE' })
  career: Career | null;

  @Column()
  careerId: string;
}
