import { Module } from '@nestjs/common';
import { ApiaryService } from './features/apiaries/providers/apiary.service';
import { ApiariesController } from './api/apiaries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiaryEntity } from './entities/apiary.entity';
import { CreateApiaryUseCase } from './features/apiaries/providers/use-cases/create-apiary-use-case';
import { ApiaryRepository } from './features/apiaries/providers/apiary.repository';
import { ApiaryQueryRepository } from './features/apiaries/providers/apiary.query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountModule } from '../account/account.module';
import { UpdateApiaryUseCase } from './features/apiaries/providers/use-cases/update-apiary-use-case';
import { DeleteApiaryUseCase } from './features/apiaries/providers/use-cases/delete-apiary-use-case';
import { BreedRepository } from './features/breeds/providers/breed.repository';
import { BreedQueryRepository } from './features/breeds/providers/breed.query.repository';
import { BreedService } from './features/breeds/providers/breed.service';
import { CreateBreedUseCase } from './features/breeds/providers/use-cases/create-breed-use-case';
import { UpdateBreedUseCase } from './features/breeds/providers/use-cases/update-breed-use-case';
import { DeleteBreedUseCase } from './features/breeds/providers/use-cases/delete-breed-use-case';
import { BreedEntity } from './entities/breed.entity';
import { BreedsController } from './api/breeds.controller';

const apiaryProviders = [
  ApiaryService,
  CreateApiaryUseCase,
  UpdateApiaryUseCase,
  DeleteApiaryUseCase,
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
@Module({
  imports: [
    TypeOrmModule.forFeature([ApiaryEntity, BreedEntity]),
    CqrsModule,
    AccountModule,
  ],
  controllers: [ApiariesController, BreedsController],
  providers: [...apiaryProviders, ...breedProviders],
})
export class ApiaryModule {}
