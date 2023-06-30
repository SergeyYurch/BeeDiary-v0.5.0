import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from './settings/settings.module';
import { ApiaryModule } from './apiary/apiary.module';
import { AccountModule } from './account/account.module';
import { TestingController } from './testing/testing.controller';
import { TestingService } from './testing/testing.service';
import { TestingTypeOrmRepository } from './testing/testing.type-orm.repository';

const configModule = ConfigModule.forRoot();

@Module({
  imports: [
    ApiaryModule,
    AccountModule,
    configModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.LOCAL_PGHOST,
      port: 5432,
      username: process.env.LOCAL_PGUSER,
      password: process.env.LOCAL_PGPASSWORD,
      database: process.env.LOCAL_PGDATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
          tls: { rejectUnauthorized: false },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    SettingsModule,
  ],
  controllers: [TestingController],
  providers: [TestingService, TestingTypeOrmRepository],
})
export class AppModule {}
