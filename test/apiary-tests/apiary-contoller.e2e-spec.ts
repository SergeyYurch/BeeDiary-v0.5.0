import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { disconnect } from 'mongoose';
import { getApp } from '../test-utils';
import { PrepareTestHelpers } from '../helpers/prepaire.test.helpers';
import { ApiaryTestHelpers } from './apiary.test-helpers';
import { ApiaryType } from '../../src/apiary/domain/apiary';

describe('Apiaries-controller (e2e)', () => {
  let app: INestApplication;
  let prepareTestHelpers: PrepareTestHelpers;
  let apiaryTestHelpers: ApiaryTestHelpers;
  const apiaries = []; // to store created apiary ids
  let accessTokens: string[]; // to store accessTokens

  beforeAll(async () => {
    app = await getApp();
    prepareTestHelpers = new PrepareTestHelpers(app);
    apiaryTestHelpers = new ApiaryTestHelpers(app);
  });

  afterAll(async () => {
    await disconnect();
    await app.close();
  });

  //preparation
  it('Preparation1', async () => {
    accessTokens = (
      await prepareTestHelpers.clearDbAndPrepareAccounts({ countOfUsers: 3 })
    ).accessTokens;
  });

  //create apiary
  it('POST: [HOST]/apiaries (POST) Add first stationary apiary to the system. Should return 201 and new apiaryViewModel', async () => {
    const createdApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    const { body: apiary } = await request(app.getHttpServer())
      .post('/apiaries')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createdApiaryDto)
      .expect(HttpStatus.CREATED);
    apiaries[0] = apiary;
  });
  it('POST: [HOST]/apiaries (POST) Add second apiary to the system. Should return 201 and new apiaryViewModel', async () => {
    const { body: a } = await apiaryTestHelpers.createApiary(
      accessTokens[0],
      2,
    );
    apiaries[1] = a;
  });

  //get apiary by id
  it('GET: [HOST]/apiaries/:id get apiary by id. Should return 200 and the apiaryViewModel', async () => {
    console.log('t1');
    console.log(apiaries[0]);
    const { body: apiary } = await request(app.getHttpServer())
      .get(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(apiary).toEqual({
      id: expect.any(String),
      beekeeper: {
        id: expect.any(String),
        login: 'user1',
      },
      type: ApiaryType.stationary,
      location: 'address test',
      schema: null,
      disbandedAt: null,
      note: 'test apiary 1',
    });
    console.log('Returned apiary:');
    console.log(apiary);
  });
  it('GET: [HOST]/apiaries/:id get apiary by id. Should return 404 if the apiaryId is missing ', async () => {
    await request(app.getHttpServer())
      .get(`/apiaries/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('GET: [HOST]/apiaries/:id get apiary by id. Should return 403 if try get the apiary that is not your own', async () => {
    await request(app.getHttpServer())
      .get(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  //get all apiaries
  it('GET: [HOST]/apiaries get all apiaries by user. Should return 200 and apiariesViewModel', async () => {
    const { body: apiaries } = await request(app.getHttpServer())
      .get(`/apiaries`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(apiaries).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: expect.any(Array),
    });

    expect(apiaries.items[0]).toEqual({
      id: expect.any(String),
      beekeeper: {
        id: expect.any(String),
        login: 'user1',
      },
      type: ApiaryType.stationary,
      location: 'address test',
      schema: null,
      disbandedAt: null,
      note: 'test apiary 1',
    });
  });

  //edit apiary
  it('PUT: [HOST]/apiaries/:id (POST) Edit apiary1. Should return 204', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.NO_CONTENT);

    const { body: apiary } = await request(app.getHttpServer())
      .get(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);

    expect(apiary).toEqual({
      id: expect.any(String),
      beekeeper: {
        id: expect.any(String),
        login: 'user1',
      },
      type: ApiaryType.stationary,
      location: 'edit location',
      schema: null,
      disbandedAt: null,
      note: 'test apiary 1',
    });
  });
  it('PUT: [HOST]/apiaries/:id (POST) Edit apiary1. Should return 404 if the apiaryId is missing', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/apiaries/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/apiaries/:id (POST) Edit apiary1. Should return 403 if  try edit the apiary that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  //delete apiary
  it('PUT: [HOST]/apiaries/:id (POST) delete apiary1. Should return 404 if the apiaryId is missing', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/apiaries/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/apiaries/:id (POST) delete apiary1. Should return 403 if  try delete the apiary that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.FORBIDDEN);
  });
  it('DELETE: [HOST]/apiaries/:id (POST) delete apiary. Should return 204', async () => {
    await request(app.getHttpServer())
      .delete(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
});
