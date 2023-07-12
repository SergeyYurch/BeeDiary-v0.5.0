import { Injectable } from '@nestjs/common';
import { IdGuard } from '../../../../common/guards/id.guard';
import { QueenQueryRepository } from '../providers/queen.query.repository';

@Injectable()
export class QueenIdGuard extends IdGuard<QueenQueryRepository> {
  constructor(queryRepository: QueenQueryRepository) {
    super(queryRepository);
  }
}
