import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ApiaryEntity } from '../../../entities/apiary.entity';
import { ApiaryViewModel } from '../dto/view-models/apiary.view.model';
import { ApiaryService } from './apiary.service';
import { PaginatorViewModel } from '../../../../common/dto/view-models/paginator.view.model';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { pagesCount } from '../../../../common/helpers/helpers';
import { NotificationResult } from '../../../../common/notification/notificationResult';
import { ApiaryQueryRepositoryInterface } from './interfaces/apiaryQueryRepositoryInterface';

export class ApiaryQueryRepository implements ApiaryQueryRepositoryInterface {
  constructor(
    readonly apiaryService: ApiaryService,
    @InjectRepository(ApiaryEntity)
    readonly apiaryRepository: Repository<ApiaryEntity>,
    @InjectDataSource() public dataSource: DataSource,
  ) {}

  async findEntityById(id: number) {
    return this.apiaryRepository.findOne({
      relations: { beekeeper: true },
      where: { id },
    });
  }

  async findAndCountEntities(
    paginatorParams: PaginatorInputType,
    beekeeperId: number,
  ) {
    const { pageSize, pageNumber } = paginatorParams;
    return this.apiaryRepository.findAndCount({
      relations: { beekeeper: true },
      where: { beekeeperId },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
    });
  }

  async getApiaryView(
    apiaryId: string,
  ): Promise<NotificationResult<ApiaryViewModel>> {
    const notification = new NotificationResult<ApiaryViewModel>();
    try {
      const apiary = await this.getApiary(+apiaryId);
      const apiaryView = await this.apiaryService.mapToApiaryView(apiary);
      notification.addData(apiaryView);
      return notification;
    } catch (e) {
      notification.addError('Something wrong');
    }
  }

  async getAllApiaryViews(
    paginatorParams: PaginatorInputType,
    userId: number,
  ): Promise<PaginatorViewModel<ApiaryViewModel>> {
    const { pageSize, pageNumber } = paginatorParams;
    const [apiaryEntities, totalCount] = await this.findAndCountEntities(
      paginatorParams,
      userId,
    );
    const items = apiaryEntities.map((a) =>
      this.apiaryService.mapToApiaryView(
        this.apiaryService.mapToDomainModel(a),
      ),
    );

    return {
      items,
      pagesCount: pagesCount(totalCount, pageSize),
      pageSize,
      totalCount,
      page: pageNumber,
    };
  }

  async getApiary(apiaryId: number) {
    const apiaryEntity = await this.findEntityById(apiaryId);
    return this.apiaryService.mapToDomainModel(apiaryEntity);
  }

  async doesApiaryIdExist(apiaryId: number) {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM apiaries a WHERE a.id=${apiaryId});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, apiaryId: string) {
    const queryString = `SELECT a."beekeeperId"=${+userId} as "isOwner" FROM apiaries a WHERE a.id=${+apiaryId};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
