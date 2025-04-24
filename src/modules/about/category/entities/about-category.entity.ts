import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AboutCategoryType, MenuKey } from '@/common/constants/about.enum';

@Entity({ name: 'about_category' })
export class AboutCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AboutCategoryType })
  type: AboutCategoryType;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  name: {
    ko: string;
    en: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  menus: MenuKey[] | null;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;
}
