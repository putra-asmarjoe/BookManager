import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('WL_ORIGIN') || 'http://localhost:3880',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setDescription('API documentation for Library Management system')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
