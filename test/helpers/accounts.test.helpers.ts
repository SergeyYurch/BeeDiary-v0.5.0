import { UsersTestHelpers } from './users.test.helpers';

import { AuthTestHelpers } from './auth.test.helpers';
import { INestApplication } from '@nestjs/common';
import { LoginInputModel } from '../../src/account/features/auth/dto/login.input.model';
import { UserInputModel } from '../../src/account/features/users/dto/input-models/user-input-model';

export class AccountsTestHelpers {
  usersTestService: UsersTestHelpers;
  authTestHelpers: AuthTestHelpers;
  constructor(private app: INestApplication) {
    this.usersTestService = new UsersTestHelpers(app);
    this.authTestHelpers = new AuthTestHelpers(app);
  }
  getUserInputModel(n: number) {
    return {
      login: `user${n}`,
      password: `password${n}`,
      email: `email${n}@gmail.com`,
    };
  }
  async createSetOfUsers(count: number, startNumber = 1) {
    for (let i = 0; i < count; i++) {
      const user: UserInputModel = this.getUserInputModel(startNumber);
      await this.usersTestService.createUser(user, 201);
      startNumber++;
    }
  }
  async createAndLoginUsers(count: number, startNumber = 1) {
    const accessTokens = [];
    const refreshTokens = [];
    await this.createSetOfUsers(count, startNumber);
    for (let i = 0; i < count; i++) {
      const loginData: LoginInputModel = {
        loginOrEmail: `user${startNumber}`,
        password: `password${startNumber}`,
      };
      const { refreshToken, accessToken } =
        await this.authTestHelpers.loginUser(loginData);
      accessTokens.push(accessToken);
      refreshTokens.push(refreshToken);
      startNumber++;
    }
    return { accessTokens, refreshTokens };
  }
}
