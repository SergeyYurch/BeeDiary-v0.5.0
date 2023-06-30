import { Module } from '@nestjs/common';
import { ApiaryService } from './features/apiaries/providers/apiary.service';
import { ApiariesController } from './api/apiaries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiaryEntity } from './features/apiaries/dto/entites/apiary.entity';
import { CreateApiaryUseCase } from './features/apiaries/providers/use-cases/create-apiary-use-case';
import { ApiaryRepository } from './features/apiaries/providers/apiary.repository';
import { ApiaryQueryRepository } from './features/apiaries/providers/apiary.query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountModule } from '../account/account.module';
import { UpdateApiaryUseCase } from './features/apiaries/providers/use-cases/update-apiary-use-case';
import { DeleteApiaryUseCase } from './features/apiaries/providers/use-cases/delete-apiary-use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiaryEntity]),
    CqrsModule,
    AccountModule,
  ],
  controllers: [ApiariesController],
  providers: [
    ApiaryService,
    CreateApiaryUseCase,
    UpdateApiaryUseCase,
    DeleteApiaryUseCase,
    ApiaryRepository,
    ApiaryQueryRepository,
  ],
})
export class ApiaryModule {}
