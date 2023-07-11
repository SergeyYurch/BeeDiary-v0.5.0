import { HiveViewModel } from '../dto/view/hive.view.model';
import { Hive } from '../../../domain/hive';
import { FrameService } from '../../frames/providers/frame.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HiveService {
  constructor(private readonly frameService: FrameService) {}
  getViewModel(domainModel: Hive): HiveViewModel {
    return {
      id: domainModel.id,
      createdAt: domainModel.createdAt.toISOString(),
      title: domainModel.title,
      width: domainModel.width,
      height: domainModel.height,
      long: domainModel.long,
      numberOfFrames: domainModel.numberOfFrames,
      frameType: domainModel.frameType
        ? this.frameService.getViewModel(domainModel.frameType)
        : null,
    };
  }
}
