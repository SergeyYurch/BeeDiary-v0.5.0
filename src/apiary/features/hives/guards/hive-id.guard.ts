import { Injectable } from '@nestjs/common';
import { IdGuard } from '../../../../common/guards/id.guard';
import { HiveQueryRepository } from '../providers/hive.query.repository';

@Injectable()
export class HiveIdGuard extends IdGuard<HiveQueryRepository> {
  constructor(queryRepository: HiveQueryRepository) {
    super(queryRepository);
  }
}
