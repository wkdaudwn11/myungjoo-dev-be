import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'about' })
export class About {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  tabKey: string;

  @Column({ type: 'varchar', length: 100 })
  menuKey: string;

  @Column({ type: 'varchar', length: 500 })
  content_ko: string;

  @Column({ type: 'varchar', length: 500 })
  content_en: string;
}
