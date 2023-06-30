import { BaseDomain } from './base-domain.class';
import { Breed } from '../types/breed';
import { Grafting } from './grafting';

export class Queen extends BaseDomain {
  constructor() {
    super();
  }
  breed: Breed;
  flybyDate: Date;
  note: string;
  condition: number;
  grafting: Grafting;
}
