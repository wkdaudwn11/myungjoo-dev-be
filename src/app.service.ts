import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    console.log('process.env.PORT', process.env.PORT);
    return 'Hello World!';
  }
}
