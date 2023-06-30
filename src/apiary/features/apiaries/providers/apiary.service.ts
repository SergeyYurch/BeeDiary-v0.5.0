import { Injectable } from '@nestjs/common';
import { ApiaryViewModel } from '../dto/view-models/apiary.view.model';
import { Apiary } from '../../../domain/apiary';

@Injectable()
export class ApiaryService {
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
}
