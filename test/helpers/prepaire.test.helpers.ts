import { INestApplication } from '@nestjs/common';
import { TestingTestHelpers } from './testing-test.helpers';
import { UsersTestHelpers } from './users.test.helpers';
import { AuthTestHelpers } from './auth.test.helpers';
import { AccountsTestHelpers } from './accounts.test.helpers';

export class PrepareOptions {
  countOfUsers?: number;
  startNumberUser?: number;
  countOfQuestions?: number;
}

export class PrepareTestHelpers {
  testingTestHelpers: TestingTestHelpers;
  usersTestService: UsersTestHelpers;
  authTestHelpers: AuthTestHelpers;
  accountsTestHelpers: AccountsTestHelpers;
  accessTokens: string[];
  refreshTokens: string[];

  constructor(private app: INestApplication) {
    this.testingTestHelpers = new TestingTestHelpers(this.app);
    this.usersTestService = new UsersTestHelpers(this.app);
    this.authTestHelpers = new AuthTestHelpers(this.app);
    this.accountsTestHelpers = new AccountsTestHelpers(app);
  }

  async clearDbAndPrepareAccounts(options?: PrepareOptions) {
    const countOfUsers = options?.countOfUsers ?? 1;
    const startNumberUser = options?.startNumberUser ?? 1;
    await this.testingTestHelpers.clearDb();
    if (countOfUsers > 0) {
      this.accessTokens = (
        await this.accountsTestHelpers.createAndLoginUsers(
          countOfUsers,
          startNumberUser,
        )
      ).accessTokens;
    }

    return { accessTokens: this.accessTokens };
  }
}
