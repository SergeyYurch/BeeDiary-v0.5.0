import { BaseDomain } from '../../common/decorators/base-domain.class';
import { Breed } from './breed';
import { Grafting } from './grafting';
import { User } from '../../account/features/users/domain/user';
import { QueenCreateDto } from '../features/queens/dto/input/queen.create.dto';
import { QueenUpdateDto } from '../features/queens/dto/input/queen.update.dto';

export class Queen extends BaseDomain {
  constructor() {
    super();
  }
  breed: Breed;
  flybyMonth: number | null;
  flybyYear: number | null;
  note: string | null;
  condition: number | null;
  // grafting: Grafting | null;
  beekeeper: User;
  static create(
    inputDto: QueenCreateDto,
    user: User,
    breed: Breed,
    // grafting: Grafting,
  ) {
    const queen = new Queen();
    queen.breed = breed;
    queen.flybyMonth = inputDto.flybyMonth;
    queen.flybyYear = inputDto.flybyYear;
    queen.note = inputDto.note;
    queen.condition = inputDto.condition;
    // queen.grafting = grafting;
    queen.beekeeper = user;
    return queen;
  }
  update(updateDto: QueenUpdateDto, breed: Breed, grafting?: Grafting | null) {
    this.breed = breed;
    this.flybyMonth = updateDto.flybyMonth;
    this.flybyYear = updateDto.flybyYear;
    this.note = updateDto.note;
    this.condition = updateDto.condition;
    // this.grafting = grafting;
  }
}
