import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5000"], // URL của frontend
    methods: 'OPTION,GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
      .setTitle('F8 k9 api')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Tăng giới hạn payload lên 10MB
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();