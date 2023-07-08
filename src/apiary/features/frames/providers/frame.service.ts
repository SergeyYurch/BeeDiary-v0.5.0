import { FrameViewModel } from '../dto/view/frame.view.model';
import { Frame } from '../../../domain/frame';

export class FrameService {
  getViewModel(domainModel: Frame): FrameViewModel {
    return {
      id: domainModel.id,
      createdAt: domainModel.createdAt,
      type: domainModel.type,
      width: domainModel.width,
      height: domainModel.height,
      cellsNumber: domainModel.cellsNumber,
    };
  }
}
