import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { DbModule } from '@/db/db.module';
import { AboutModule } from '@/modules/about/about.module';
import { AboutCategoryModule } from '@/modules/about/category/about-category.module';
import { CareerModule } from '@/modules/career/career.module';
import { HealthModule } from '@/modules/health/health.module';
import { HelloModule } from '@/modules/hello/hello.module';
import { ProjectModule } from '@/modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    DbModule,
    AboutModule,
    AboutCategoryModule,
    CareerModule,
    HealthModule,
    HelloModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
