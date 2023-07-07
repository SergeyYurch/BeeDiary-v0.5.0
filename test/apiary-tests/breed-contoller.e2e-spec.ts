import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { disconnect } from 'mongoose';
import { getApp } from '../test-utils';
import { PrepareTestHelpers } from '../helpers/prepaire.test.helpers';
import { ApiaryTestHelpers } from './apiary.test-helpers';
import { BreedViewModel } from '../../src/apiary/features/breeds/dto/view-models/breed.view.model';

describe('breeds-controller (e2e)', () => {
  let app: INestApplication;
  let prepareTestHelpers: PrepareTestHelpers;
  let apiaryTestHelpers: ApiaryTestHelpers;
  const breeds: BreedViewModel[] = [];
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
  it('POST: [HOST]/breeds (POST) Add first breed. Should return 201 and new breedViewModel', async () => {
    const createBreedDto = apiaryTestHelpers.generateCreateBreedDto(1);
    const { body: breed } = await request(app.getHttpServer())
      .post('/breeds')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createBreedDto)
      .expect(HttpStatus.CREATED);
    breeds[0] = breed;
    expect(breed).toEqual({
      id: expect.any(String),
      title: 'breed 1',
    });
  });
  it('POST: [HOST]/breeds (POST) Send data does not match inputDto. Should return 400 -BadRequest', async () => {
    const { body: errMessage } = await request(app.getHttpServer())
      .post('/breeds')
      .auth(accessTokens[0], { type: 'bearer' })
      .send({ key: 333 })
      .expect(HttpStatus.BAD_REQUEST);
    console.log('errMessage', errMessage);
    expect(errMessage.errorsMessages[0].field).toBe('title');
  });
  it('POST: [HOST]/breeds (POST) Add second breed. Should return 201 and new breedViewModel', async () => {
    const breed = await apiaryTestHelpers.createBreed(accessTokens[0], 2);
    breeds[1] = breed;
    expect(breed).toEqual({
      id: expect.any(String),
      title: 'breed 2',
    });
  });

  //get  by id
  it('GET: [HOST]/breeds/:id get breed by id. Should return 200 and the breedViewModel', async () => {
    const { body: breed } = await request(app.getHttpServer())
      .get(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(breed).toEqual({
      id: expect.any(String),
      title: 'breed 1',
    });
  });
  it('GET: [HOST]/breeds/:id get breed by id. Should return 403 if the breed was not created by the user', async () => {
    await request(app.getHttpServer())
      .get(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('GET: [HOST]/breeds/:id get breed by id. Should return 404 if the breedId is missing ', async () => {
    await request(app.getHttpServer())
      .get(`/breeds/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });

  //get all
  // it('GET: [HOST]/breeds get all apiaries by user. Should return 200 and apiariesViewModel', async () => {
  //   const { body: apiaries } = await request(app.getHttpServer())
  //     .get(`/apiaries`)
  //     .auth(accessTokens[0], { type: 'bearer' })
  //     .expect(HttpStatus.OK);
  //   expect(apiaries).toEqual({
  //     pagesCount: 1,
  //     page: 1,
  //     pageSize: 10,
  //     totalCount: 2,
  //     items: expect.any(Array),
  //   });
  //
  //   expect(apiaries.items[0]).toEqual({
  //     id: expect.any(String),
  //     beekeeper: {
  //       id: expect.any(String),
  //       login: 'user1',
  //     },
  //     type: ApiaryType.stationary,
  //     location: 'address test',
  //     schema: null,
  //     disbandedAt: null,
  //     note: 'test apiary 1',
  //   });
  // });

  //edit
  it('PUT: [HOST]/breeds/:id (POST) Edit breed1. Should return 204', async () => {
    await request(app.getHttpServer())
      .put(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({ title: 'breed edit' })
      .expect(HttpStatus.NO_CONTENT);

    const { body: breed } = await request(app.getHttpServer())
      .get(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);

    expect(breed).toEqual({
      id: expect.any(String),
      title: 'breed edit',
    });
  });
  it('PUT: [HOST]/breeds/:id (POST) Edit breed1. Should return 404 if the breedId is missing', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/breeds/1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send({ title: 'breed edit' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/breeds/:id (POST) Edit breed1. Should return 403 if you try to edit the breed that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  //delete
  it('DELETE: [HOST]/breeds/:id (POST) delete breed1. Should return 404 if the breedId is missing', async () => {
    await request(app.getHttpServer())
      .delete(`/breeds/1}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('DELETE: [HOST]/breeds/:id (POST) delete breed1. Should return 403 if  try delete the breed that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });
  it('DELETE: [HOST]/breeds/:id (POST) delete breed1. Should return 204', async () => {
    await request(app.getHttpServer())
      .delete(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/breeds/${breeds[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
});
