import { Repository, ObjectLiteral } from 'typeorm';

export const getNextOrder = async <T extends ObjectLiteral>(
  repo: Repository<T>,
  column: keyof T,
): Promise<number> => {
  const result = await repo
    .createQueryBuilder('entity')
    .select(`MAX(entity.${String(column)})`, 'max')
    .getRawOne<{ max: number }>();
  return (result?.max ?? 0) + 1;
};
