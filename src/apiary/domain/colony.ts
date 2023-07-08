import { BaseDomain } from '../../common/decorators/base-domain.class';
import { Hive } from './hive';
import { Frame } from './frame';
import { Queen } from './queen';
import { DangerStatusEnum } from '../types/danger-status.enum';

export class Colony extends BaseDomain {
  number: number;
  hive: Hive;
  nestsFrameType: Frame;
  queen: Queen;
  condition: number;
  note: string;
  status: DangerStatusEnum;
  constructor() {
    super();
  }
}
