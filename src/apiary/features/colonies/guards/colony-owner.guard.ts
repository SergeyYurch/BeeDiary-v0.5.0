import { Injectable } from '@nestjs/common';
import { OwnerGuard } from '../../../../common/guards/owner.guard';
import { ColonyQueryRepository } from '../providers/colony.query.repository';

@Injectable()
export class ColonyOwnerGuard extends OwnerGuard<ColonyQueryRepository> {
  constructor(queryRepository: ColonyQueryRepository) {
    super(queryRepository);
  }
}
