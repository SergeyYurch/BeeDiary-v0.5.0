import { Module } from '@nestjs/common';
import { ApiaryService } from './features/apiaries/providers/apiary.service';
import { ApiariesController } from './api/apiaries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiaryEntity } from './entities/apiary.entity';
import { ApiaryCreateUseCase } from './features/apiaries/providers/use-cases/apiary.create.use-case';
import { ApiaryRepository } from './features/apiaries/providers/apiary.repository';
import { ApiaryQueryRepository } from './features/apiaries/providers/apiary.query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountModule } from '../account/account.module';
import { ApiaryUpdateUseCase } from './features/apiaries/providers/use-cases/apiary.update.use-case';
import { ApiaryDeleteUseCase } from './features/apiaries/providers/use-cases/apiary.delete.use-case';
import { BreedRepository } from './features/breeds/providers/breed.repository';
import { BreedQueryRepository } from './features/breeds/providers/breed.query.repository';
import { BreedService } from './features/breeds/providers/breed.service';
import { CreateBreedUseCase } from './features/breeds/providers/use-cases/create-breed-use-case';
import { UpdateBreedUseCase } from './features/breeds/providers/use-cases/update-breed-use-case';
import { DeleteBreedUseCase } from './features/breeds/providers/use-cases/delete-breed-use-case';
import { BreedEntity } from './entities/breed.entity';
import { BreedsController } from './api/breeds.controller';
import { FrameRepository } from './features/frames/providers/frame.repository';
import { FrameQueryRepository } from './features/frames/providers/frame.query.repository';
import { FrameCreateUseCase } from './features/frames/providers/use-cases/frame-create-use-case';
import { FrameUpdateUseCase } from './features/frames/providers/use-cases/frame-update-use-case';
import { FrameDeleteUseCase } from './features/frames/providers/use-cases/frame-delete-use-case';
import { FrameService } from './features/frames/providers/frame.service';
import { FrameEntity } from './entities/frame.entity';
import { FramesController } from './api/frames.controller';
import { HiveController } from './api/hive.controller';
import { HiveQueryRepository } from './features/hives/providers/hive.query.repository';
import { HiveCreateUseCase } from './features/hives/providers/use-cases/hive-create-use-case';
import { HiveDeleteUseCase } from './features/hives/providers/use-cases/hive-delete-use-case';
import { HiveUpdateUseCase } from './features/hives/providers/use-cases/hive-update-use-case';
import { HiveRepository } from './features/hives/providers/hive.repository';
import { HiveService } from './features/hives/providers/hive.service';
import { HiveEntity } from './entities/hive.entity';
import { QueenRepository } from './features/queens/providers/queen.repository';
import { QueenEntity } from './entities/queen.entity';
import { QueensController } from './api/queens.controller';
import { QueenCreateUseCase } from './features/queens/providers/use-cases/queen.create.use-case';
import { QueenQueryRepository } from './features/queens/providers/queen.query.repository';
import { QueenDeleteUseCase } from './features/queens/providers/use-cases/queen.delete.use-case';
import { QueenService } from './features/queens/providers/queen.service';
import { QueenUpdateUseCase } from './features/queens/providers/use-cases/queen.update.use-case';
import { ColonyRepository } from './features/colonies/providers/colony.repository';
import { ColonyUpdateUseCase } from './features/colonies/providers/use-cases/colony.update.use-case';
import { ColonyQueryRepository } from './features/colonies/providers/colony.query.repository';
import { ColonyCreateUseCase } from './features/colonies/providers/use-cases/colony.create.use-case';
import { ColonyService } from './features/colonies/providers/colony.service';
import { ColonyDeleteUseCase } from './features/colonies/providers/use-cases/colony.delete.use-case';
import { ColonyEntity } from './entities/colony.entity';
import { ColonyController } from './api/colony.controller';

const apiaryProviders = [
  ApiaryService,
  ApiaryCreateUseCase,
  ApiaryUpdateUseCase,
  ApiaryDeleteUseCase,
  ApiaryRepository,
  ApiaryQueryRepository,
];
const breedProviders = [
  BreedRepository,
  BreedQueryRepository,
  BreedService,
  CreateBreedUseCase,
  UpdateBreedUseCase,
  DeleteBreedUseCase,
];

const frameProviders = [
  FrameRepository,
  FrameQueryRepository,
  FrameCreateUseCase,
  FrameUpdateUseCase,
  FrameDeleteUseCase,
  FrameService,
];

const hiveProviders = [
  HiveRepository,
  HiveQueryRepository,
  HiveCreateUseCase,
  HiveUpdateUseCase,
  HiveDeleteUseCase,
  HiveService,
];

const queenProviders = [
  QueenRepository,
  QueenQueryRepository,
  QueenCreateUseCase,
  QueenUpdateUseCase,
  QueenDeleteUseCase,
  QueenService,
];

const colonyProviders = [
  ColonyRepository,
  ColonyQueryRepository,
  ColonyCreateUseCase,
  ColonyUpdateUseCase,
  ColonyDeleteUseCase,
  ColonyService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiaryEntity,
      BreedEntity,
      FrameEntity,
      HiveEntity,
      QueenEntity,
      ColonyEntity,
    ]),
    CqrsModule,
    AccountModule,
  ],
  controllers: [
    ApiariesController,
    BreedsController,
    FramesController,
    HiveController,
    QueensController,
    ColonyController,
  ],
  providers: [
    ...apiaryProviders,
    ...breedProviders,
    ...frameProviders,
    ...hiveProviders,
    ...queenProviders,
    ...colonyProviders,
  ],
})
export class ApiaryModule {}
