import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        ssl: { rejectUnauthorized: false },
        synchronize: config.get('NODE_ENV') === 'development',
        entities: [`${__dirname}/../**/*.entity.{ts,js}`],
        logging: true,
        autoLoadEntities: true,
        parseInt8: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DbModule {}
