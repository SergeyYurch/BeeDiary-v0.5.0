import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { disconnect } from 'mongoose';
import { getApp } from '../test-utils';
import { PrepareTestHelpers } from '../helpers/prepaire.test.helpers';
import { ApiaryTestHelpers } from './apiary.test-helpers';
import { ApiaryType } from '../../src/apiary/domain/apiary';
import { QueenViewModel } from '../../src/apiary/features/queens/dto/view/queen.view.model';
import { ColonyViewDto } from '../../src/apiary/features/colonies/dto/view/colony.view.dto';

describe('Colonies-controller (e2e)', () => {
  let app: INestApplication;
  let prepareTestHelpers: PrepareTestHelpers;
  let apiaryTestHelpers: ApiaryTestHelpers;
  const colonies: ColonyViewDto[] = []; // to store created colony ids
  const queens: QueenViewModel[] = [];
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

  //create colony
  it('POST: [HOST]/colonies (POST) Add first colony. Should return 201 and viewModel', async () => {
    const { body: createdQueen } = await apiaryTestHelpers.createQueen(
      accessTokens[0],
      1,
    );
    queens[0] = createdQueen;
    const createColonyDto = await apiaryTestHelpers.generateCreateColonyDto(
      1,
      createdQueen.id,
    );
    const { body: colony } = await request(app.getHttpServer())
      .post('/colonies')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createColonyDto)
      .expect(HttpStatus.CREATED);
    colonies[0] = colony;
    expect(colony).toEqual({
      number: 1,
      queenId: queens[0].id,
      note: 'note',
      condition: 5,
      hiveTypeId: 1,
      nestsFrameTypeId: 1,
    });
  });

  //get colony by id
  it('GET: [HOST]/colonies/:id get colony by id. Should return 200 and the apiaryViewModel', async () => {
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
  it('GET: [HOST]/colonies/:id get colony by id. Should return 404 if the apiaryId is missing ', async () => {
    await request(app.getHttpServer())
      .get(`/apiaries/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('GET: [HOST]/colonies/:id get colony by id. Should return 403 if try get the apiary that is not your own', async () => {
    await request(app.getHttpServer())
      .get(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  //get all colonies
  it('GET: [HOST]/colonies get all colonies by user. Should return 200 and apiariesViewModel', async () => {
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

  //edit colony
  it('PUT: [HOST]/colonies/:id (POST) Edit colony. Should return 204', async () => {
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
  it('PUT: [HOST]/colonies/:id (POST) Edit colony. Should return 404 if the apiaryId is missing', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/apiaries/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/colonies/:id (POST) Edit colony. Should return 403 if  try edit the apiary that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  //delete colony
  it('PUT: [HOST]/colonies/:id (POST) delete colony. Should return 404 if the apiaryId is missing', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/apiaries/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/colonies/:id (POST) delete colony. Should return 403 if  try delete the apiary that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/apiaries/${apiaries[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.FORBIDDEN);
  });
  it('DELETE: [HOST]/colonies/:id (POST) delete colony. Should return 204', async () => {
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
