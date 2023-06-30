import { BaseDomain } from './base-domain.class';
import { User } from '../../account/features/users/domain/user';
import { CreateApiaryDto } from '../features/apiaries/dto/input/create-apiary.dto';

export class Apiary extends BaseDomain {
  beekeeper: User;
  type: ApiaryType;
  location: string;
  schema: string;
  createdAt: Date;
  disbandedAt: Date;
  note: string;

  constructor() {
    super();

    this.type = ApiaryType.stationary;
  }

  static create(inputDto: CreateApiaryDto, user: User): Apiary {
    const apiary = new Apiary();
    apiary.createdAt = new Date(inputDto.createdAt);
    apiary.beekeeper = user;
    apiary.type = inputDto.type;
    apiary.location = inputDto.location;
    apiary.note = inputDto.note;
    apiary.createdAt = new Date(inputDto.createdAt);
    return apiary;
  }
}

export enum ApiaryType {
  stationary = 'stationary',
  remote = 'remote',
}
