import { Injectable } from '@nestjs/common';
import { BreedQueryRepository } from '../providers/breed.query.repository';
import { IdGuard } from '../../../../common/guards/id.guard';

@Injectable()
export class BreedIdGuard extends IdGuard<BreedQueryRepository> {
  constructor(queryRepository: BreedQueryRepository) {
    super(queryRepository);
  }
}
