import { ApiaryService } from '../apiary.service';
import { DataSource, Repository } from 'typeorm';
import { ApiaryEntity } from '../../dto/entites/apiary.entity';
import { PaginatorInputType } from '../../../../../common/dto/input-models/paginator.input.type';
import { NotificationResult } from '../../../../../common/notification/notificationResult';
import { ApiaryViewModel } from '../../dto/view-models/apiary.view.model';
import { PaginatorViewModel } from '../../../../../common/dto/view-models/paginator.view.model';
import { Apiary } from '../../../../domain/apiary';

export interface ApiaryQueryRepositoryInterface {
  readonly apiaryService: ApiaryService;
  readonly apiaryRepository: Repository<ApiaryEntity>;
  dataSource: DataSource;

  findEntityById(id: number): Promise<ApiaryEntity>;

  findAndCountEntities(
    paginatorParams: PaginatorInputType,
    beekeeperId: number,
  ): Promise<[ApiaryEntity[], number]>;

  getApiaryView(apiaryId: string): Promise<NotificationResult<ApiaryViewModel>>;

  getAllApiaryViews(
    paginatorParams: PaginatorInputType,
    userId: number,
  ): Promise<PaginatorViewModel<ApiaryViewModel>>;

  getApiary(apiaryId: number): Promise<Apiary>;

  doesApiaryIdExist(apiaryId: number): Promise<boolean>;

  isOwner(userId: string, apiaryId: string): Promise<boolean>;
}
