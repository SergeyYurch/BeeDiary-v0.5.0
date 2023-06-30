import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configApp } from './config/config-app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configApp(app);
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`App started listening PORT:${port}`);
}
bootstrap().then();
