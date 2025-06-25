import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento de Biblioteca')
    .setDescription(
      'Documentação da API REST para gerenciamento de livros e autores.',
    )
    .setVersion('1.0')
    .addTag('Autores', 'Operações relacionadas a autores')
    .addTag('Livros', 'Operações relacionadas a livros')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Acessível em http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
