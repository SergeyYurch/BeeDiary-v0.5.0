import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { disconnect } from 'mongoose';
import { getApp } from '../test-utils';
import { PrepareTestHelpers } from '../helpers/prepaire.test.helpers';
import { ApiaryTestHelpers } from './apiary.test-helpers';
import { FrameViewModel } from '../../src/apiary/features/frames/dto/view/frame.view.model';
import { HiveViewModel } from '../../src/apiary/features/hives/dto/view/hive.view.model';

describe('frames-controller (e2e)', () => {
  let app: INestApplication;
  let prepareTestHelpers: PrepareTestHelpers;
  let apiaryTestHelpers: ApiaryTestHelpers;
  const frames: FrameViewModel[] = [];
  const hives: HiveViewModel[] = [];
  let accessTokens: string[]; // to store accessTokens

  beforeAll(async () => {
    app = await getApp();
    prepareTestHelpers = new PrepareTestHelpers(app);
    apiaryTestHelpers = new ApiaryTestHelpers(app);
    accessTokens = (
      await prepareTestHelpers.clearDbAndPrepareAccounts({ countOfUsers: 3 })
    ).accessTokens;
  });

  afterAll(async () => {
    await disconnect();
    await app.close();
  });

  // //preparation
  // it('Preparation', async () => {
  //   accessTokens = (
  //     await prepareTestHelpers.clearDbAndPrepareAccounts({ countOfUsers: 3 })
  //   ).accessTokens;
  // });

  //create
  it('POST: [HOST]/hives (POST) Add first hive. Should return 201 and new ViewModel', async () => {
    frames[0] = await apiaryTestHelpers.createFrame(accessTokens[0], 1);
    const createDto = apiaryTestHelpers.generateHiveCreateDto(1, frames[0].id);
    const { body: hive } = await request(app.getHttpServer())
      .post('/hives')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createDto)
      .expect(HttpStatus.CREATED);
    hives[0] = hive;
    expect(hive).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      title: 'Hive type1',
      width: 500,
      height: 450,
      long: 500,
      numberOfFrames: 10,
      frameType: {
        id: expect.any(String),
        createdAt: expect.any(String),
        type: 'Dadan1',
        width: 435,
        height: 300,
        numberOfCells: 9000,
      },
    });
  });
  it('POST: [HOST]/hives (POST) Try create second hive without frame. Should return 201 and new ViewModel', async () => {
    const createDto = apiaryTestHelpers.generateHiveCreateDto(2);
    const { body: hive } = await request(app.getHttpServer())
      .post('/hives')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createDto)
      .expect(HttpStatus.CREATED);
    hives[1] = hive;
    expect(hive).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      title: 'Hive type2',
      width: 500,
      height: 450,
      long: 500,
      numberOfFrames: 10,
      frameType: null,
    });
  });
  it('POST: [HOST]/hives (POST) Add third hive. Should return 201 and new ViewModel', async () => {
    const hive = await apiaryTestHelpers.createHive(
      accessTokens[0],
      3,
      frames[0].id,
    );
    hives[2] = hive;
    expect(hive).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      title: 'Hive type3',
      width: 500,
      height: 450,
      long: 500,
      numberOfFrames: 10,
      frameType: {
        id: expect.any(String),
        createdAt: expect.any(String),
        type: 'Dadan1',
        width: 435,
        height: 300,
        numberOfCells: 9000,
      },
    });
  });
  it('POST: [HOST]/hives (POST) Send data does not match inputDto. Should return 400 -BadRequest', async () => {
    const { body: errMessage } = await request(app.getHttpServer())
      .post('/hives')
      .auth(accessTokens[0], { type: 'bearer' })
      .send({
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameTypeId: null,
      })
      .expect(HttpStatus.BAD_REQUEST);
    console.log('errMessage', errMessage);
    expect(errMessage.errorsMessages[0].field).toBe('title');
  });

  //get  by id
  it('GET: [HOST]/hives/:id get hive by id. Should return 200 and the ViewModel', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/hives/${hives[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      title: 'Hive type1',
      width: 500,
      height: 450,
      long: 500,
      numberOfFrames: 10,
      frameType: {
        id: expect.any(String),
        createdAt: expect.any(String),
        type: 'Dadan1',
        width: 435,
        height: 300,
        numberOfCells: 9000,
      },
    });
  });
  it('GET: [HOST]/hives/:id get hive by id. Should return 403 if the frame was not created by the user', async () => {
    await request(app.getHttpServer())
      .get(`/hives/${hives[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('GET: [HOST]/hives/:id get hive by id. Should return 404 if the id is missing ', async () => {
    await request(app.getHttpServer())
      .get(`/hives/-1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  // get all
  it('GET: [HOST]/hives get all hive by user. Should return 200 and paginationViewModel with all viewModels', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/hives`)
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
      title: 'Hive type1',
      width: 500,
      height: 450,
      long: 500,
      numberOfFrames: 10,
      frameType: {
        id: expect.any(String),
        createdAt: expect.any(String),
        type: 'Dadan1',
        width: 435,
        height: 300,
        numberOfCells: 9000,
      },
    });
  });

  //edit
  it('PUT: [HOST]/hives/:id (POST) Edit hive. Should return 204', async () => {
    await request(app.getHttpServer())
      .put(`/hives/${hives[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({
        title: `Hive type edit`,
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameTypeId: null,
      })
      .expect(HttpStatus.NO_CONTENT);

    const { body } = await request(app.getHttpServer())
      .get(`/hives/${hives[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);

    expect(body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      title: 'Hive type edit',
      width: 500,
      height: 450,
      long: 500,
      numberOfFrames: 10,
      frameType: null,
    });
  });
  it('PUT: [HOST]/hives/:id (POST) Edit hive. Should return 404 if the hiveId is missing', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/hives/-1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({
        id: expect.any(String),
        createdAt: expect.any(String),
        title: 'Hive type1',
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameType: null,
      })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/hives/:id (POST) Edit hive. Should return 403 if you try to edit the hive that is not your', async () => {
    await request(app.getHttpServer())
      .put(`/hives/${hives[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send({
        id: expect.any(String),
        createdAt: expect.any(String),
        title: 'Hive type1',
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameType: null,
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  //delete
  it('DELETE: [HOST]/hives/:id (POST) delete hive1. Should return 404 if the id is missing', async () => {
    await request(app.getHttpServer())
      .delete(`/hives/-1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('DELETE: [HOST]/hives/:id (POST) delete hive1. Should return 403 if  try delete the hive that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/hives/${hives[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('DELETE: [HOST]/hives/:id (POST) delete hive1. Should return 204', async () => {
    await request(app.getHttpServer())
      .delete(`/hives/${hives[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/hives/${hives[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
});
