import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserInputModel } from '../../src/account/features/users/dto/input-models/user-input-model';

export class UsersTestHelpers {
  constructor(private app: INestApplication) {}

  async createUser(user: UserInputModel, statusCode: number) {
    return request(this.app.getHttpServer())
      .post('/sa/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(user)
      .expect(statusCode);
  }
}
