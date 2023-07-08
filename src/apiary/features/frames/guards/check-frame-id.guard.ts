import { Injectable } from '@nestjs/common';
import { CheckIdGuard } from '../../../../common/guards/check-id.guard';
import { FrameQueryRepository } from '../providers/frame.query.repository';

@Injectable()
export class CheckFrameIdGuard extends CheckIdGuard<FrameQueryRepository> {
  constructor(queryRepository: FrameQueryRepository) {
    super(queryRepository);
  }
}
