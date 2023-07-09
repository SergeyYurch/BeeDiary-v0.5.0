import { Injectable } from '@nestjs/common';
import { BreedQueryRepository } from '../providers/breed.query.repository';
import { CheckIdGuard } from '../../../../common/guards/check-id.guard';

@Injectable()
export class BreedIdGuard extends CheckIdGuard<BreedQueryRepository> {
  constructor(queryRepository: BreedQueryRepository) {
    super(queryRepository);
  }
}
