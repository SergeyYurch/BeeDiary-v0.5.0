import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { swaggerSetup } from './swagger-setup';
import { AppModule } from '../app.module';

export function configApp(app: INestApplication) {
  app.enableCors();
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  pipeSetup(app);
  exceptionFilterSetup(app);
  swaggerSetup(app);
}
