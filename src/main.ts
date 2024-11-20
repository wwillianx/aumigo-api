import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // Allow all origins
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out any properties that aren't in the DTO
      forbidNonWhitelisted: true, // Throws an error if any unknown values are passed
      transform: true, // Automatically transforms payloads to match DTO types
    }),
  );

  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Aumigo API')
    .setVersion('1.0')
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Endpoint for accessing Swagger UI

  await app.listen(3000);
}
bootstrap();
