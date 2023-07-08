import { EventType } from '../types/event-type';
import { DangerStatusEnum } from '../types/danger-status.enum';
import { Colony } from './colony';
import { BaseDomain } from '../../common/decorators/base-domain.class';

export class Event extends BaseDomain {
  type: EventType;
  status: DangerStatusEnum;
  executionDate: Date;
  completed: boolean;
  colony: Colony;
  content: string;
  audio: string[];
  pictures: string[];
}
