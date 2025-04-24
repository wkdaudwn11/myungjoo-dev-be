import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { LangType } from '@/common/constants/lang-type.enum';

@Entity({ name: 'hello' })
@Unique(['lang'])
export class Hello {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LangType,
  })
  lang: LangType;

  @Column({ type: 'varchar', length: 100 })
  text01: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  text02: string;

  @Column({ type: 'jsonb', nullable: true })
  code: {
    title: string;
    github_text: string;
    email_text: string;
    email_button_text: string;
    text01: string;
    text02: string;
  };
}
