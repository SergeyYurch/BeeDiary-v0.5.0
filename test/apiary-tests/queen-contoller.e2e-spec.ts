import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { disconnect } from 'mongoose';
import { getApp } from '../test-utils';
import { PrepareTestHelpers } from '../helpers/prepaire.test.helpers';
import { ApiaryTestHelpers } from './apiary.test-helpers';
import { QueenViewModel } from '../../src/apiary/features/queens/dto/view/queen.view.model';
import { BreedViewModel } from '../../src/apiary/features/breeds/dto/view/breed.view.model';

describe('queens-controller (e2e)', () => {
  let app: INestApplication;
  let prepareTestHelpers: PrepareTestHelpers;
  let apiaryTestHelpers: ApiaryTestHelpers;
  const queens: QueenViewModel[] = [];
  let testBreed1: BreedViewModel;
  let accessTokens: string[]; // to store accessTokens

  beforeAll(async () => {
    app = await getApp();
    prepareTestHelpers = new PrepareTestHelpers(app);
    apiaryTestHelpers = new ApiaryTestHelpers(app);
    accessTokens = (
      await prepareTestHelpers.clearDbAndPrepareAccounts({ countOfUsers: 3 })
    ).accessTokens;
    testBreed1 = await apiaryTestHelpers.createBreed(accessTokens[0], 1);
  });

  afterAll(async () => {
    await disconnect();
    await app.close();
  });

  //create
  it('POST: [HOST]/queens (POST) Add first queen. Should return 201 and new ViewModel', async () => {
    const createDto = apiaryTestHelpers.generateQueenCreateDto(
      1,
      testBreed1.id,
    );
    console.log('createDto', createDto);
    const { body: queen } = await request(app.getHttpServer())
      .post('/queens')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createDto)
      .expect(HttpStatus.CREATED);
    queens[0] = queen;
    expect(queen).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      breed: {
        id: expect.any(String),
        createdAt: expect.any(String),
        title: 'breed 1',
      },
      note: 'queen1',
      condition: 5,
      flybyYear: 2020,
      flybyMonth: 5,
      grafting: null,
    });
  });
  it('POST: [HOST]/queens (POST) Try create second queen without breed. Should return 201 and new ViewModel', async () => {
    const createDto = apiaryTestHelpers.generateQueenCreateDto(
      2,
      testBreed1.id,
    );
    const { body: queen } = await request(app.getHttpServer())
      .post('/queens')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createDto)
      .expect(HttpStatus.CREATED);
    queens[1] = queen;
    expect(queen).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      breed: {
        id: expect.any(String),
        createdAt: expect.any(String),
        title: 'breed 1',
      },
      note: 'queen2',
      condition: 5,
      flybyYear: 2020,
      flybyMonth: 5,
      grafting: null,
    });
  });
  it('POST: [HOST]/queens (POST) Add third queen. Should return 201 and new ViewModel', async () => {
    const queen = await apiaryTestHelpers.createQueen(
      accessTokens[0],
      3,
      testBreed1.id,
    );
    queens[2] = queen;
    expect(queen).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      breed: {
        id: testBreed1.id,
        createdAt: expect.any(String),
        title: 'breed 1',
      },
      note: 'queen3',
      condition: 5,
      flybyYear: 2020,
      flybyMonth: 5,
      grafting: null,
    });
  });
  it('POST: [HOST]/queens (POST) Send data does not match inputDto. Should return 400 -BadRequest', async () => {
    const { body: errMessage } = await request(app.getHttpServer())
      .post('/queens')
      .auth(accessTokens[0], { type: 'bearer' })
      .send({
        breedId: testBreed1.id,
        note: `queen1`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 13,
        graftingId: null,
      })
      .expect(HttpStatus.BAD_REQUEST);
    console.log('errMessage', errMessage);
    expect(errMessage.errorsMessages[0].field).toBe('flybyMonth');
  });

  //get  by id
  it('GET: [HOST]/queens/:id get queen by id. Should return 200 and the ViewModel', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/queens/${queens[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      breed: {
        id: testBreed1.id,
        createdAt: expect.any(String),
        title: 'breed 1',
      },
      note: 'queen1',
      condition: 5,
      flybyYear: 2020,
      flybyMonth: 5,
      grafting: null,
    });
  });
  it('GET: [HOST]/queens/:id get queen by id. Should return 403 if the frame was not created by the user', async () => {
    await request(app.getHttpServer())
      .get(`/queens/${queens[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('GET: [HOST]/queens/:id get queen by id. Should return 404 if the id is missing ', async () => {
    await request(app.getHttpServer())
      .get(`/queens/-1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  // get all
  it('GET: [HOST]/queens get all queens by user. Should return 200 and paginationViewModel with all viewModels', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/queens`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: expect.any(Array),
    });

    expect(body.items[0]).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      breed: {
        id: testBreed1.id,
        createdAt: expect.any(String),
        title: 'breed 1',
      },
      note: 'queen1',
      condition: 5,
      flybyYear: 2020,
      flybyMonth: 5,
      grafting: null,
    });
  });

  //edit
  it('PUT: [HOST]/queens/:id (POST) Edit queen. Should return 204', async () => {
    await request(app.getHttpServer())
      .put(`/queens/${queens[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({
        breedId: testBreed1.id,
        note: `queen edit`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        graftingId: null,
      })
      .expect(HttpStatus.NO_CONTENT);

    const { body } = await request(app.getHttpServer())
      .get(`/queens/${queens[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);

    expect(body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      breed: {
        id: testBreed1.id,
        createdAt: expect.any(String),
        title: 'breed 1',
      },
      note: 'queen edit',
      condition: 5,
      flybyYear: 2020,
      flybyMonth: 5,
      grafting: null,
    });
  });
  it('PUT: [HOST]/queens/:id (POST) Edit queen. Should return 404 if the queenId is missing', async () => {
    await request(app.getHttpServer())
      .put(`/queens/-1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({
        breedId: testBreed1.id,
        note: `queen edit`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        graftingId: null,
      })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/queens/:id (POST) Edit queen. Should return 403 if you try to edit the queen that is not your', async () => {
    await request(app.getHttpServer())
      .put(`/queens/${queens[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send({
        breedId: testBreed1.id,
        note: `queen edit`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        graftingId: null,
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  //delete
  it('DELETE: [HOST]/queens/:id (POST) delete queen. Should return 404 if the id is missing', async () => {
    await request(app.getHttpServer())
      .delete(`/queens/-1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('DELETE: [HOST]/queens/:id (POST) delete queen. Should return 403 if  try delete the queen that is not your', async () => {
    await request(app.getHttpServer())
      .delete(`/queens/${queens[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('DELETE: [HOST]/queens/:id (POST) delete queen. Should return 204', async () => {
    await request(app.getHttpServer())
      .delete(`/queens/${queens[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/queens/${queens[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
});
