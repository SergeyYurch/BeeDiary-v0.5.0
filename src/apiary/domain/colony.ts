import { BaseDomain } from './base-domain.class';
import { Hive } from '../types/hive';
import { Frame } from '../types/frame';
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
