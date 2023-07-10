import { HiveViewModel } from '../dto/view/hive.view.model';
import { Hive } from '../../../domain/hive';
import { FrameService } from '../../frames/providers/frame.service';

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
      frameType: this.frameService.getViewModel(domainModel.frameType),
    };
  }
}
