import { CreateApiaryDto } from '../../src/apiary/features/apiaries/dto/input/create-apiary.dto';
import { ApiaryType } from '../../src/apiary/domain/apiary';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateColonyDto } from '../../src/apiary/features/colonies/dto/input/create-colony.dto';
import { QueenCreateDto } from '../../src/apiary/features/queens/dto/input/queen.create.dto';
import { CreateBreedDto } from '../../src/apiary/features/breeds/dto/input/create-breed.dto';
import { FrameCreateDto } from '../../src/apiary/features/frames/dto/input/frame-create.dto';
import { HiveCreateDto } from '../../src/apiary/features/hives/dto/input/hive.create.dto';

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

  generateCreateColonyDto(n, queenId): CreateColonyDto {
    return {
      number: n,
      queenId,
      note: 'note',
      condition: 5,
      hiveTypeId: 1,
      nestsFrameTypeId: 1,
    };
  }

  generateCreateBreedDto(n): CreateBreedDto {
    return {
      title: `breed ${n}`,
    };
  }

  generateFrameCreateDto(n: number): FrameCreateDto {
    return {
      type: `Dadan${n}`,
      numberOfCells: 9000,
      height: 300,
      width: 435,
    };
  }
  generateHiveCreateDto(n: number, frameTypeId?: string): HiveCreateDto {
    return {
      title: `Hive type${n}`,
      width: 500,
      height: 450,
      long: 500,
      numberOfFrames: 10,
      frameTypeId: frameTypeId ?? null,
    };
  }

  generateQueenCreateDto(n: number, breedId?: string): QueenCreateDto {
    return {
      breedId,
      note: `queen${n}`,
      condition: 5,
      flybyYear: 2020,
      flybyMonth: 5,
      graftingId: null,
    };
  }

  async createHive(accessToken: string, n: number, frameTypeId?: string) {
    const createDto = this.generateHiveCreateDto(n, frameTypeId);
    const { body } = await request(this.app.getHttpServer())
      .post('/hives')
      .auth(accessToken, { type: 'bearer' })
      .send(createDto)
      .expect(HttpStatus.CREATED);
    return body;
  }

  async createFrame(accessToken: string, n: number) {
    const createDto = this.generateFrameCreateDto(n);
    const { body } = await request(this.app.getHttpServer())
      .post('/frames')
      .auth(accessToken, { type: 'bearer' })
      .send(createDto)
      .expect(HttpStatus.CREATED);
    return body;
  }

  async createBreed(accessToken: string, n: number) {
    const createBreedDto = this.generateCreateBreedDto(n);
    console.log('accessTokens', accessToken);
    const { body: breed } = await request(this.app.getHttpServer())
      .post('/breeds')
      .auth(accessToken, { type: 'bearer' })
      .send(createBreedDto)
      .expect(HttpStatus.CREATED);
    return breed;
  }

  async createApiary(accessTokens: string, n: number) {
    const createdApiaryDto = this.generateCreateApiaryDto(n);

    return request(this.app.getHttpServer())
      .post('/apiaries')
      .auth(accessTokens, { type: 'bearer' })
      .send(createdApiaryDto)
      .expect(HttpStatus.CREATED);
  }

  async createColony(accessTokens: string, n: number, queenId: number) {
    const createdColonyDto = this.generateCreateColonyDto(n, queenId);

    return request(this.app.getHttpServer())
      .post('/colonies')
      .auth(accessTokens, { type: 'bearer' })
      .send(createdColonyDto)
      .expect(HttpStatus.CREATED);
  }

  async createQueen(accessToken: string, n: number, testBreedId?: string) {
    const createQueenDto = this.generateQueenCreateDto(n, testBreedId);
    const { body } = await request(this.app.getHttpServer())
      .post('/queens')
      .auth(accessToken, { type: 'bearer' })
      .send(createQueenDto)
      .expect(HttpStatus.CREATED);
    return body;
  }
}
