import { Injectable } from '@nestjs/common';
import { OwnerGuard } from '../../../../common/guards/owner.guard';
import { FrameQueryRepository } from '../providers/frame.query.repository';

@Injectable()
export class FrameOwnerGuard extends OwnerGuard<FrameQueryRepository> {}
