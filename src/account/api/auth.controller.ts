import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginInputModel } from '../features/auth/dto/login.input.model';
import { Request, Response } from 'express';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { UserInputModel } from '../features/users/dto/input-models/user-input-model';
import { RegistrationConfirmationCodeInputModel } from '../features/auth/dto/registration-confirmation-code.input.model';
import { RegistrationEmailResendingInputModel } from '../features/auth/dto/registration-email-resending.input.model';
import { PasswordRecoveryInputModel } from '../features/auth/dto/password-recovery.input.model';
import { NewPasswordRecoveryInputModel } from '../features/auth/dto/new-password-recovery.input.model';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { CurrentUserJwtInfo } from '../decorators/current-user.param.decorator';
import { JwtPayloadType } from '../../blog/features/blogs/types/jwt-payload.type';
import { CommandBus } from '@nestjs/cqrs';
import { SignInCommand } from '../features/auth/providers/use-cases/sign-in-use-case';
import { LogoutCommand } from '../features/auth/providers/use-cases/logout-use-case';
import { RefreshTokenCommand } from '../features/auth/providers/use-cases/refresh-token-use-cases';
import { RegistrationUserCommand } from '../features/users/providers/use-cases/registration-user-use-case';
import { RegistrationConfirmationCommand } from '../features/auth/providers/use-cases/registration-confirmation-use-case';
import { RegistrationEmailResendingCommand } from '../features/auth/providers/use-cases/registration-email-resending-use-case';
import { PasswordRecoveryCommand } from '../features/auth/providers/use-cases/password-recovery-use-case';
import { SetNewPasswordCommand } from '../features/auth/providers/use-cases/set-new-password-use-case';
import { UsersQueryTypeormRepository } from '../features/users/providers/users.query-typeorm.repository';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';

@ApiTags('auth')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private usersQueryRepository: UsersQueryTypeormRepository,
    private commandBus: CommandBus,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}
  @Get('google')
  async googleOAuth(@Query() query: any) {
    console.log('oauth/google');
    const code = query.code;
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    console.log('googleAuthCallback');
    console.log(req.user);
    // const token = await this.authService.signIn(req.user);

    // res.cookie('access_token', token, {
    //   maxAge: 2592000000,
    //   sameSite: true,
    //   secure: false,
    // });

    return res.status(HttpStatus.OK);
  }

  @ApiBearerAuth()
  @SkipThrottle()
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getAuthInfo(@CurrentUserJwtInfo() { userId }: JwtPayloadType) {
    const result = await this.usersQueryRepository.getMeInfo(userId);
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
  // @UseGuards(LocalAuthGuard)
  @SkipThrottle()
  @HttpCode(200)
  @Post('/login')
  async signIn(
    @Body() loginDto: LoginInputModel,
    @Ip() ip: string,
    @Headers('X-Forwarded-For') title: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    console.log('LOGIN!!!!!!!!!!!!!!!!!!!!!');
    const { accessToken, refreshToken, expiresDate } =
      await this.commandBus.execute(
        new SignInCommand(loginDto.loginOrEmail, loginDto.password, ip, title),
      );
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(expiresDate),
      secure: true,
      httpOnly: true,
    });
    console.log(
      `[AuthController]/signIn: login  user: ${loginDto.loginOrEmail}, refreshToken: ${refreshToken}`,
    );
    return { accessToken: accessToken };
  }

  @ApiBearerAuth()
  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const { userId, deviceId } = req.user;
    await this.commandBus.execute(new LogoutCommand(userId, deviceId));
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }

  @ApiBearerAuth()
  @SkipThrottle()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshTokens(
    @Ip() ip: string,
    @Headers('X-Forwarded-For') title: string,
    @Res() res: Response, //{ passthrough: true }
    @CurrentUserJwtInfo() { userId, deviceId }: JwtPayloadType,
  ) {
    console.log(
      `[AuthController]/POST:/refresh-token:userID: ${userId}, deviceId:${deviceId}`,
    );
    const { accessToken, refreshToken, expiresDate } =
      await this.commandBus.execute(new RefreshTokenCommand(userId, deviceId));
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(expiresDate),
      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({ accessToken: accessToken });
  }

  @HttpCode(204)
  @Post('/registration')
  async registration(@Body() userInputDto: UserInputModel) {
    await this.commandBus.execute(new RegistrationUserCommand(userInputDto));
  }

  @HttpCode(204)
  @Post('/registration-confirmation')
  async registrationConfirmation(
    @Body() codeDto: RegistrationConfirmationCodeInputModel,
  ) {
    await this.commandBus.execute(
      new RegistrationConfirmationCommand(codeDto.code),
    );
  }

  @HttpCode(204)
  @Post('/registration-email-resending')
  async registrationEmailResending(
    @Body() emailResendingDto: RegistrationEmailResendingInputModel,
  ) {
    await this.commandBus.execute(
      new RegistrationEmailResendingCommand(emailResendingDto.email),
    );
  }

  @HttpCode(204)
  @Post('/password-recovery')
  async passwordRecovery(
    @Body() passwordRecoveryDto: PasswordRecoveryInputModel,
  ) {
    await this.commandBus.execute(
      new PasswordRecoveryCommand(passwordRecoveryDto.email),
    );
  }

  @HttpCode(204)
  @Post('/new-password')
  async newPassword(@Body() newPasswordDto: NewPasswordRecoveryInputModel) {
    await this.commandBus.execute(
      new SetNewPasswordCommand(
        newPasswordDto.recoveryCode,
        newPasswordDto.newPassword,
      ),
    );
  }

  @HttpCode(204)
  @Get('/test')
  async test() {
    await this.usersQueryRepository.test();
  }
}
