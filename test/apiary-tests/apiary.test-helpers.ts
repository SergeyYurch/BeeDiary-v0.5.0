import { CreateApiaryDto } from '../../src/apiary/features/apiaries/dto/input/create-apiary.dto';
import { ApiaryType } from '../../src/apiary/domain/apiary';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

export class ApiaryTestHelpers {
  constructor(private app: INestApplication) {}

  generateCreateApiaryDto(n): CreateApiaryDto {
    return {
      type: ApiaryType.stationary,
      createdAt: new Date().toISOString(),
      note: `test apiary ${n}`,
      location: 'address test',
    };
  }

  async createApiary(accessTokens: string, n: number) {
    const createdApiaryDto = this.generateCreateApiaryDto(n);

    return request(this.app.getHttpServer())
      .post('/apiaries')
      .auth(accessTokens, { type: 'bearer' })
      .send(createdApiaryDto)
      .expect(HttpStatus.CREATED);
  }
}
