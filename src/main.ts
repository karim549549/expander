import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Ensure crypto is available on globalThis for libraries that call crypto.randomUUID()
// (some downstream packages call globalThis.crypto.randomUUID directly).
import * as nodeCrypto from 'crypto';
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = nodeCrypto;
}

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
