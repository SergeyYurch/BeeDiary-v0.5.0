import { Injectable } from '@nestjs/common';
import { OwnerGuard } from '../../../../common/guards/owner.guard';
import { QueenQueryRepository } from '../providers/queen.query.repository';

@Injectable()
export class QueenOwnerGuard extends OwnerGuard<QueenQueryRepository> {
  constructor(queryRepository: QueenQueryRepository) {
    super(queryRepository);
  }
}
