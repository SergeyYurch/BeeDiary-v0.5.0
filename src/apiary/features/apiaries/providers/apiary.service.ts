import { Injectable } from '@nestjs/common';
import { ApiaryViewModel } from '../dto/view-models/apiary.view.model';
import { Apiary } from '../../../domain/apiary';
import { ApiaryEntity } from '../../../entities/apiary.entity';
import { UsersService } from '../../../../account/features/users/providers/users.service';

@Injectable()
export class ApiaryService {
  constructor(private readonly usersService: UsersService) {}
  mapToApiaryView(apiary: Apiary): ApiaryViewModel {
    return {
      id: apiary.id.toString(),
      beekeeper: {
        id: apiary.beekeeper.id.toString(),
        login: apiary.beekeeper.accountData.login,
      },
      type: apiary.type,
      location: apiary.location,
      schema: apiary.schema,
      disbandedAt: apiary.disbandedAt ? apiary.disbandedAt.toISOString() : null,
      note: apiary.note,
    };
  }
  mapToDomainModel(apiaryEntity: ApiaryEntity) {
    const apiary = new Apiary();
    apiary.id = apiaryEntity.id;
    apiary.beekeeper = this.usersService.mapToUserDomainModel(
      apiaryEntity.beekeeper,
    );
    apiary.createdAt = apiaryEntity.createdAt;
    apiary.note = apiaryEntity.note;
    apiary.type = apiaryEntity.type;
    apiary.location = apiaryEntity.location;
    apiary.disbandedAt = apiaryEntity.disbandedAt;
    apiary.schema = apiaryEntity.schema;
    return apiary;
  }
}
