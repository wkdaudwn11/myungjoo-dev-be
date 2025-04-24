import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('myungjoo-dev-be API')
  .setDescription('myungjoo-dev-be')
  .setVersion('0.1.0')
  .build();
