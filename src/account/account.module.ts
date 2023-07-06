import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './features/users/entities/user.entity';
import { DeviceSessionsEntity } from './features/users/entities/device-sessions.entity';
import { PasswordRecoveryInformationEntity } from './features/users/entities/password-recovery-information.entity';
import { AuthController } from './api/auth.controller';
import { SaUsersController } from './api/sa-users.controller';
import { SecurityController } from './api/security.controller';
import { DeleteUserUseCase } from './features/users/providers/use-cases/delete-user-use-case';
import { BanUserUseCase } from './features/users/providers/use-cases/ban-user-use-case';
import { DeleteAllSessionExcludeCurrentUseCase } from './features/security/providers/use-cases/delete-all-sessions-exclude-current.use-case';
import { RegistrationUserUseCase } from './features/users/providers/use-cases/registration-user-use-case';
import { PasswordRecoveryUseCase } from './features/auth/providers/use-cases/password-recovery-use-case';
import { RefreshTokenUseCases } from './features/auth/providers/use-cases/refresh-token-use-cases';
import { GetSessionsByUserIdUseCase } from './features/security/providers/use-cases/get-sessions-by-user-id.use-case';
import { DeleteSessionByIdUseCase } from './features/security/providers/use-cases/delete-session-by-id.use-case';
import { ValidateUserUseCase } from './features/auth/providers/use-cases/validate-user.use-case';
import { CreateNewUserUseCase } from './features/users/providers/use-cases/create-new-user-use-case';
import { RegistrationConfirmationUseCase } from './features/auth/providers/use-cases/registration-confirmation-use-case';
import { RegistrationEmailResendingUseCase } from './features/auth/providers/use-cases/registration-email-resending-use-case';
import { LogoutUseCase } from './features/auth/providers/use-cases/logout-use-case';
import { SignInUseCase } from './features/auth/providers/use-cases/sign-in-use-case';
import { ValidateUserDeviceSessionUseCase } from './features/auth/providers/use-cases/validate-user-device-session.use-case';
import { SetNewPasswordUseCase } from './features/auth/providers/use-cases/set-new-password-use-case';
import { UsersTypeOrmRepository } from './features/users/providers/users.typeorm.repository';
import { UsersService } from './features/users/providers/users.service';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { tokenService } from './features/auth/providers/token.service';
import { LocalStrategy } from './strategies/local.strategy';
import { IsUniqLoginOrEmailConstraint } from './validators/login-or-emai-uniq-validate';
import { UsersQueryTypeormRepository } from './features/users/providers/users.query-typeorm.repository';
import { SecurityService } from './features/security/providers/security.service';
import { BasicStrategy } from './strategies/auth-basic.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from '../common/mail.service/mail.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenUStrategy } from './strategies/access-token-u.strategy';
const userEntities = [
  UserEntity,
  DeviceSessionsEntity,
  PasswordRecoveryInformationEntity,
];

const usersUseCases = [
  CreateNewUserUseCase,
  DeleteUserUseCase,
  RegistrationUserUseCase,
  BanUserUseCase,
];
const authUseCases = [
  LogoutUseCase,
  PasswordRecoveryUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  SetNewPasswordUseCase,
  SignInUseCase,
  RefreshTokenUseCases,
  ValidateUserDeviceSessionUseCase,
  ValidateUserUseCase,
];
const securityUseCases = [
  DeleteSessionByIdUseCase,
  DeleteAllSessionExcludeCurrentUseCase,
  GetSessionsByUserIdUseCase,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([...userEntities]),
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
  ],
  controllers: [
    AuthController,
    //BloggerUsersController,
    SaUsersController,
    SecurityController,
  ],
  providers: [
    ...securityUseCases,
    ...usersUseCases,
    ...authUseCases,
    //security
    SecurityService,
    //users
    UsersService,
    UsersQueryTypeormRepository,
    UsersTypeOrmRepository,

    //auth
    tokenService,

    BasicStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
    AccessTokenStrategy,
    AccessTokenUStrategy,
    MailService,
    JwtService,
    ConfigService,

    //decorators
    //IsBlogExistConstraint,
    IsUniqLoginOrEmailConstraint,
  ],
  exports: [UsersQueryTypeormRepository, UsersService],
})
export class AccountModule {}
