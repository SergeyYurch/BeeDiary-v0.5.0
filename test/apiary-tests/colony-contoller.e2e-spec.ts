import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { disconnect } from 'mongoose';
import { getApp } from '../test-utils';
import { PrepareTestHelpers } from '../helpers/prepaire.test.helpers';
import { ApiaryTestHelpers } from './apiary.test-helpers';
import { QueenViewModel } from '../../src/apiary/features/queens/dto/view/queen.view.model';
import { ColonyViewModel } from '../../src/apiary/features/colonies/dto/view/colony.view.model';
import { BreedViewModel } from '../../src/apiary/features/breeds/dto/view/breed.view.model';
import { HiveViewModel } from '../../src/apiary/features/hives/dto/view/hive.view.model';
import { FrameViewModel } from '../../src/apiary/features/frames/dto/view/frame.view.model';
import { ColonyCreateDto } from '../../src/apiary/features/colonies/dto/input/colony.create.dto';

describe('Colonies-controller (e2e)', () => {
  let app: INestApplication;
  let prepareTestHelpers: PrepareTestHelpers;
  let apiaryTestHelpers: ApiaryTestHelpers;
  const colonies: ColonyViewModel[] = []; // to store created colony ids
  const queens: QueenViewModel[] = [];
  const breeds: BreedViewModel[] = [];
  const hives: HiveViewModel[] = [];
  const frames: FrameViewModel[] = [];
  const createDtos: ColonyCreateDto[] = [];
  let accessTokens: string[]; // to store accessTokens

  beforeAll(async () => {
    app = await getApp();
    prepareTestHelpers = new PrepareTestHelpers(app);
    apiaryTestHelpers = new ApiaryTestHelpers(app);
    accessTokens = (
      await prepareTestHelpers.clearDbAndPrepareAccounts({ countOfUsers: 3 })
    ).accessTokens;
    frames[0] = await apiaryTestHelpers.createFrame(accessTokens[0], 1);
    hives[0] = await apiaryTestHelpers.createHive(
      accessTokens[0],
      1,
      frames[0].id,
    );
    breeds[0] = await apiaryTestHelpers.createBreed(accessTokens[0], 1);
    for (let i = 0; i < 2; i++) {
      queens[i] = await apiaryTestHelpers.createQueen(
        accessTokens[0],
        i + 1,
        breeds[0].id,
      );
    }
  });

  afterAll(async () => {
    await disconnect();
    await app.close();
  });

  //create colony
  it('POST: [HOST]/colonies (POST) Add first colony. Should return 201 and viewModel', async () => {
    const createColonyDto = await apiaryTestHelpers.generateCreateColonyDto(
      1,
      hives[0].id,
      frames[0].id,
      queens[0].id,
    );
    createDtos[0] = createColonyDto;
    const { body: colony } = await request(app.getHttpServer())
      .post('/colonies')
      .auth(accessTokens[0], { type: 'bearer' })
      .send(createColonyDto)
      .expect(HttpStatus.CREATED);
    colonies[0] = colony;
    expect(colony).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      number: 1,
      hiveType: {
        id: hives[0].id,
        createdAt: expect.any(String),
        title: 'Hive type1',
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameType: {
          id: frames[0].id,
          createdAt: expect.any(String),
          type: `Dadan1`,
          numberOfCells: 9000,
          height: 300,
          width: 435,
        },
      },
      nestFrameType: {
        id: frames[0].id,
        createdAt: expect.any(String),
        type: `Dadan1`,
        numberOfCells: 9000,
        height: 300,
        width: 435,
      },
      queen: {
        id: queens[0].id,
        createdAt: expect.any(String),
        breed: {
          id: breeds[0].id,
          createdAt: expect.any(String),
          title: 'breed 1',
        },
        note: `queen1`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        grafting: null,
      },
      note: 'note',
      condition: 5,
      status: 2,
    });
  });
  it('POST: [HOST]/colonies (POST) Add second colony with helper. Should return 201 and viewModel', async () => {
    const createColonyDto = await apiaryTestHelpers.generateCreateColonyDto(
      2,
      hives[0].id,
      frames[0].id,
      queens[0].id,
    );
    createDtos[1] = createColonyDto;
    const colony = await apiaryTestHelpers.createColony(
      accessTokens[0],
      2,
      createColonyDto,
    );
    colonies[1] = colony;
    expect(colony).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      number: 2,
      hiveType: {
        id: hives[0].id,
        createdAt: expect.any(String),
        title: 'Hive type1',
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameType: {
          id: frames[0].id,
          createdAt: expect.any(String),
          type: `Dadan1`,
          numberOfCells: 9000,
          height: 300,
          width: 435,
        },
      },
      nestFrameType: {
        id: frames[0].id,
        createdAt: expect.any(String),
        type: `Dadan1`,
        numberOfCells: 9000,
        height: 300,
        width: 435,
      },
      queen: {
        id: queens[0].id,
        createdAt: expect.any(String),
        breed: {
          id: breeds[0].id,
          createdAt: expect.any(String),
          title: 'breed 1',
        },
        note: `queen1`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        grafting: null,
      },
      note: 'note',
      condition: 5,
      status: 2,
    });
  });
  it('POST: [HOST]/colonies (POST) Add third colony with helper. Should return 201 and viewModel', async () => {
    const createColonyDto = await apiaryTestHelpers.generateCreateColonyDto(
      3,
      hives[0].id,
      frames[0].id,
      queens[0].id,
    );
    createDtos[2] = createColonyDto;
    colonies[2] = await apiaryTestHelpers.createColony(
      accessTokens[0],
      3,
      createColonyDto,
    );
  });

  //get colony by id
  it('GET: [HOST]/colonies/:id get colony by id. Should return 200 and the ViewModel', async () => {
    const { body: colony } = await request(app.getHttpServer())
      .get(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(colony).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      number: 1,
      hiveType: {
        id: hives[0].id,
        createdAt: expect.any(String),
        title: 'Hive type1',
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameType: {
          id: frames[0].id,
          createdAt: expect.any(String),
          type: `Dadan1`,
          numberOfCells: 9000,
          height: 300,
          width: 435,
        },
      },
      nestFrameType: {
        id: frames[0].id,
        createdAt: expect.any(String),
        type: `Dadan1`,
        numberOfCells: 9000,
        height: 300,
        width: 435,
      },
      queen: {
        id: queens[0].id,
        createdAt: expect.any(String),
        breed: {
          id: breeds[0].id,
          createdAt: expect.any(String),
          title: 'breed 1',
        },
        note: `queen1`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        grafting: null,
      },
      note: 'note',
      condition: 5,
      status: 2,
    });
  });

  it('GET: [HOST]/colonies/:id get colony by id. Should return 404 if the id is missing ', async () => {
    await request(app.getHttpServer())
      .get(`/colonies/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
  it('GET: [HOST]/colonies/:id get colony by id. Should return 403 if try get the product that is not your own', async () => {
    await request(app.getHttpServer())
      .get(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .expect(HttpStatus.FORBIDDEN);
  });

  //get all colonies
  it('GET: [HOST]/colonies get all colonies by user. Should return 200 and viewModel', async () => {
    const { body: apiaries } = await request(app.getHttpServer())
      .get(`/colonies`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);
    expect(apiaries).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: expect.any(Array),
    });

    expect(apiaries.items[0]).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      number: 1,
      hiveType: {
        id: hives[0].id,
        createdAt: expect.any(String),
        title: 'Hive type1',
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameType: {
          id: frames[0].id,
          createdAt: expect.any(String),
          type: `Dadan1`,
          numberOfCells: 9000,
          height: 300,
          width: 435,
        },
      },
      nestFrameType: {
        id: frames[0].id,
        createdAt: expect.any(String),
        type: `Dadan1`,
        numberOfCells: 9000,
        height: 300,
        width: 435,
      },
      queen: {
        id: queens[0].id,
        createdAt: expect.any(String),
        breed: {
          id: breeds[0].id,
          createdAt: expect.any(String),
          title: 'breed 1',
        },
        note: `queen1`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        grafting: null,
      },
      note: 'note',
      condition: 5,
      status: 2,
    });
  });

  //edit colony
  it('PUT: [HOST]/colonies/:id (POST) Edit colony. Should return 204', async () => {
    const editedDto = createDtos[0];
    editedDto.status = 0;
    await request(app.getHttpServer())
      .put(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedDto)
      .expect(HttpStatus.NO_CONTENT);

    const { body: colony } = await request(app.getHttpServer())
      .get(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.OK);

    expect(colony).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      number: 1,
      hiveType: {
        id: hives[0].id,
        createdAt: expect.any(String),
        title: 'Hive type1',
        width: 500,
        height: 450,
        long: 500,
        numberOfFrames: 10,
        frameType: {
          id: frames[0].id,
          createdAt: expect.any(String),
          type: `Dadan1`,
          numberOfCells: 9000,
          height: 300,
          width: 435,
        },
      },
      nestFrameType: {
        id: frames[0].id,
        createdAt: expect.any(String),
        type: `Dadan1`,
        numberOfCells: 9000,
        height: 300,
        width: 435,
      },
      queen: {
        id: queens[0].id,
        createdAt: expect.any(String),
        breed: {
          id: breeds[0].id,
          createdAt: expect.any(String),
          title: 'breed 1',
        },
        note: `queen1`,
        condition: 5,
        flybyYear: 2020,
        flybyMonth: 5,
        grafting: null,
      },
      note: 'note',
      condition: 5,
      status: 0,
    });
  });
  it('PUT: [HOST]/colonies/:id (POST) Edit colony. Should return 404 if the id is missing', async () => {
    const editedDto = createDtos[0];
    editedDto.status = 0;
    await request(app.getHttpServer())
      .put(`/colonies/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedDto)
      .expect(HttpStatus.NOT_FOUND);
  });
  it('PUT: [HOST]/colonies/:id (POST) Edit colony. Should return 403 if  try edit the colony that is not your', async () => {
    const editedDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedDto.location = 'edit location';
    await request(app.getHttpServer())
      .put(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send(editedDto)
      .expect(HttpStatus.FORBIDDEN);
  });

  //delete colony
  it('DELETE: [HOST]/colonies/:id (POST) delete colony. Should return 404 if the id is missing', async () => {
    const editedApiaryDto = createDtos[0];
    editedApiaryDto.status = 0;
    await request(app.getHttpServer())
      .delete(`/colonies/1`)
      .auth(accessTokens[0], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.NOT_FOUND);
  });
  it('DELETE: [HOST]/colonies/:id (POST) delete colony. Should return 403 if  try delete the apiary that is not your', async () => {
    const editedApiaryDto = apiaryTestHelpers.generateCreateApiaryDto(1);
    editedApiaryDto.location = 'edit location';
    await request(app.getHttpServer())
      .delete(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[1], { type: 'bearer' })
      .send(editedApiaryDto)
      .expect(HttpStatus.FORBIDDEN);
  });
  it('DELETE: [HOST]/colonies/:id (POST) delete colony. Should return 204', async () => {
    await request(app.getHttpServer())
      .delete(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .get(`/colonies/${colonies[0].id}`)
      .auth(accessTokens[0], { type: 'bearer' })
      .expect(HttpStatus.NOT_FOUND);
  });
});
