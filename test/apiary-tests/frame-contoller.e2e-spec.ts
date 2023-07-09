import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { disconnect } from 'mongoose';
import { getApp } from '../test-utils';
import { PrepareTestHelpers } from '../helpers/prepaire.test.helpers';
import { ApiaryTestHelpers } from './apiary.test-helpers';
import { BreedViewModel } from '../../src/apiary/features/breeds/dto/view/breed.view.model';
import { FrameViewModel } from '../../src/apiary/features/frames/dto/view/frame.view.model';

describe('frames-controller (e2e)', () => {
  let app: INestApplication;
  let prepareTestHelpers: PrepareTestHelpers;
  let apiaryTestHelpers: ApiaryTestHelpers;
  const frames: FrameViewModel[] = [];
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
  it('Preparation', async () => {
    accessTokens = (
      await prepareTestHelpers.clearDbAndPrepareAccounts({ countOfUsers: 3 })
    ).accessTokens;
  });

  //create
  it('POST: [HOST]/frames (POST) Add first frame. Should return 201 and new ViewModel', async () => {
    const createDto = apiaryTestHelpers.generateFrameCreateDto(1);
    const { body: frame } = await request(app.getHttpServer())
      .post('/frames')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createDto)
      .expect(HttpStatus.CREATED);
    frames[0] = frame;
    expect(frame).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      type: 'Dadan1',
      width: 435,
      height: 300,
      cellsNumber: 9000,
    });
  });
  it('POST: [HOST]/frames (POST) Send data does not match inputDto. Should return 400 -BadRequest', async () => {
    const { body: errMessage } = await request(app.getHttpServer())
      .post('/frames')
      .auth(accessTokens[0], { type: 'bearer' })
      .send({ type: 'type', width: 'null', height: 300, cellsNumber: 9000 })
      .expect(HttpStatus.BAD_REQUEST);
    console.log('errMessage', errMessage);
    expect(errMessage.errorsMessages[0].field).toBe('width');
  });
  it('POST: [HOST]/frames (POST) Add second breed. Should return 201 and new ViewModel', async () => {
    const res = await apiaryTestHelpers.createFrame(accessTokens[0], 2);
    frames[1] = res;
  });

  //get  by id
  it('GET: [HOST]/frames/:id get frame by id. Should return 200 and the ViewModel', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/frames/${frames[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      type: 'Dadan1',
      width: 435,
      height: 300,
      cellsNumber: 9000,
    });
  });
  it('GET: [HOST]/frames/:id get frame by id. Should return 403 if the frame was not created by the user', async () => {
    await request(app.getHttpServer())
      .get(`/frames/${frames[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('GET: [HOST]/frames/:id get frame by id. Should return 404 if the id is missing ', async () => {
    await request(app.getHttpServer())
      .get(`/frames/-1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  // get all
  it('GET: [HOST]/frames get all frames by user. Should return 200 and viewModel', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/frames`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: expect.any(Array),
    });

    expect(body.items[0]).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      type: 'Dadan1',
      width: 435,
      height: 300,
      cellsNumber: 9000,
    });
  });

  //edit
  it('PUT: [HOST]/frames/:id (POST) Edit frame1. Should return 204', async () => {
    await request(app.getHttpServer())
      .put(`/frames/${frames[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({
        type: 'Dadan-edit',
        width: 435,
        height: 300,
        cellsNumber: 9000,
      })
      .expect(HttpStatus.NO_CONTENT);

    const { body } = await request(app.getHttpServer())
      .get(`/frames/${frames[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);

    expect(body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      type: 'Dadan-edit',
      width: 435,
      height: 300,
      cellsNumber: 9000,
    });
  });
  it('PUT: [HOST]/frames/:id (POST) Edit frame1. Should return 404 if the breedId is missing', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/frames/1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({ type: 'Dadan-edit', width: 435, height: 300, cellsNumber: 9000 })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/frames/:id (POST) Edit frame1. Should return 403 if you try to edit the breed that is not your', async () => {
    await request(app.getHttpServer())
      .put(`/frames/${frames[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send({ type: 'Dadan-edit', width: 435, height: 300, cellsNumber: 9000 })
      .expect(HttpStatus.FORBIDDEN);
  });

  //delete
  it('DELETE: [HOST]/frames/:id (POST) delete frame1. Should return 404 if the id is missing', async () => {
    await request(app.getHttpServer())
      .delete(`/frames/1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('DELETE: [HOST]/frames/:id (POST) delete frame1. Should return 403 if  try delete the frame that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/frames/${frames[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('DELETE: [HOST]/frames/:id (POST) delete frame1. Should return 204', async () => {
    await request(app.getHttpServer())
      .delete(`/frames/${frames[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/frames/${frames[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
});
