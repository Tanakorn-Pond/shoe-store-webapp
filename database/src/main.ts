import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const frontendOrigin = config.get<string>('FRONTEND_ORIGIN');

  app.enableCors({
    origin: frontendOrigin ? frontendOrigin : true,

    credentials: true,
  });
  await app.listen(3000);

  console.log('🚀 Server running on http://localhost:3000');
}

void bootstrap();
