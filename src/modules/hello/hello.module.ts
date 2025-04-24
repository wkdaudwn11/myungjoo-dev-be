import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hello } from './entities/hello.entity';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hello])],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
