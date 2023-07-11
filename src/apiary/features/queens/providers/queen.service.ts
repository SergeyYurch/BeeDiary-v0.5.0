import { Injectable } from '@nestjs/common';
import { BreedService } from '../../breeds/providers/breed.service';
import { Queen } from '../../../domain/queen';
import { QueenViewModel } from '../dto/view/queen.view.model';

@Injectable()
export class QueenService {
  constructor(private readonly service: BreedService) {}
  getViewModel(domainModel: Queen): QueenViewModel {
    return {
      id: domainModel.id,
      createdAt: domainModel.createdAt.toISOString(),
      breed: this.service.getViewModel(domainModel.breed),
      flybyMonth: domainModel.flybyMonth,
      flybyYear: domainModel.flybyYear,
      note: domainModel.note,
      condition: domainModel.condition,
      grafting: domainModel.grafting,
    };
  }
}
