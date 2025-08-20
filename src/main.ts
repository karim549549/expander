// Ensure crypto is available on globalThis for libraries that call crypto.randomUUID()
// This must run before importing AppModule/TypeORM so helpers that call
// crypto.randomUUID() during module evaluation don't crash.
import * as nodeCrypto from 'crypto';
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = nodeCrypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
