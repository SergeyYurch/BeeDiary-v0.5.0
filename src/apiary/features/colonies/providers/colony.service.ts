import { Injectable } from '@nestjs/common';
import { ColonyViewModel } from '../dto/view/colony.view.model';
import { HiveService } from '../../hives/providers/hive.service';
import { Colony } from '../../../domain/colony';
import { FrameService } from '../../frames/providers/frame.service';
import { QueenService } from '../../queens/providers/queen.service';

@Injectable()
export class ColonyService {
  constructor(
    private readonly hiveService: HiveService,
    private readonly frameService: FrameService,
    private readonly queenService: QueenService,
  ) {}
  getViewModel(domainModel: Colony): ColonyViewModel {
    return {
      id: domainModel.id,
      createdAt: domainModel.createdAt.toISOString(),
      number: domainModel.number,
      hive: this.hiveService.getViewModel(domainModel.hive),
      nestFrameType: this.frameService.getViewModel(domainModel.nestFrameType),
      queen: this.queenService.getViewModel(domainModel.queen),
      condition: domainModel.condition,
      note: domainModel.note,
      status: domainModel.status,
    };
  }
}
