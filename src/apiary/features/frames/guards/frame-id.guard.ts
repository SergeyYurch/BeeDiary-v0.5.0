import { Injectable } from '@nestjs/common';
import { IdGuard } from '../../../../common/guards/id.guard';
import { FrameQueryRepository } from '../providers/frame.query.repository';

@Injectable()
export class FrameIdGuard extends IdGuard<FrameQueryRepository> {
  constructor(queryRepository: FrameQueryRepository) {
    super(queryRepository);
  }
}
