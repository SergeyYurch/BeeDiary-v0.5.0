import { Injectable } from '@nestjs/common';
import { IdGuard } from '../../../../common/guards/id.guard';
import { ColonyQueryRepository } from '../providers/colony.query.repository';

@Injectable()
export class ColonyIdGuard extends IdGuard<ColonyQueryRepository> {
  constructor(queryRepository: ColonyQueryRepository) {
    super(queryRepository);
  }
}
