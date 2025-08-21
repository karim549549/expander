import { webcrypto } from 'crypto';

// Polyfill for environments where global.crypto is not available
if (typeof global.crypto === 'undefined') {
  // @ts-ignore
  global.crypto = webcrypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // New import
import { ValidationPipe } from '@nestjs/common'; // Added for global validation pipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Register global validation pipe (optional, but good practice)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE ?? 'Expander API')
    .setDescription(
      process.env.SWAGGER_DESC ?? 'Global expansion management API',
    )
    .setVersion(process.env.SWAGGER_VERSION ?? '1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();