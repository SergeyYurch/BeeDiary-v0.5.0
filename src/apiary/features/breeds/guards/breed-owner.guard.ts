import { Injectable } from '@nestjs/common';
import { BreedQueryRepository } from '../providers/breed.query.repository';
import { OwnerGuard } from '../../../../common/guards/owner.guard';

@Injectable()
export class BreedOwnerGuard extends OwnerGuard<BreedQueryRepository> {
  constructor(queryRepository: BreedQueryRepository) {
    super(queryRepository);
  }
}
