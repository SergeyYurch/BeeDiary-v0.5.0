import { Injectable } from '@nestjs/common';
import { OwnerGuard } from '../../../../common/guards/owner.guard';
import { HiveQueryRepository } from '../providers/hive.query.repository';

@Injectable()
export class HiveOwnerGuard extends OwnerGuard<HiveQueryRepository> {
  constructor(queryRepository: HiveQueryRepository) {
    super(queryRepository);
  }
}
