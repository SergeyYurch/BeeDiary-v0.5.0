import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ApiaryEntity } from '../dto/entites/apiary.entity';
import { ApiaryViewModel } from '../dto/view-models/apiary.view.model';
import { ApiaryService } from './apiary.service';
import { PaginatorViewModel } from '../../../../common/dto/view-models/paginator.view.model';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { pagesCount } from '../../../../common/helpers/helpers';
import { Apiary } from '../../../domain/apiary';
import { UsersService } from '../../../../account/features/users/providers/users.service';
import { NotificationResult } from '../../../../common/notification/notificationResult';

export class ApiaryQueryRepository {
  constructor(
    private readonly apiaryService: ApiaryService,
    private readonly usersService: UsersService,
    @InjectRepository(ApiaryEntity)
    private readonly apiaryRepository: Repository<ApiaryEntity>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
  async findEntityById(id: number) {
    return this.apiaryRepository.findOne({
      relations: { beekeeper: true },
      where: { id },
    });
  }

  async findEntities(paginatorParams: PaginatorInputType, beekeeperId: number) {
    const { pageSize, pageNumber } = paginatorParams;
    const res = await this.apiaryRepository.findAndCount({
      relations: { beekeeper: true },
      where: { beekeeperId },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
    });
    console.log('t111');
    console.log(res);
    return res;
  }

  async getApiaryView(
    apiaryId: string,
  ): Promise<NotificationResult<ApiaryViewModel>> {
    const notification = new NotificationResult<ApiaryViewModel>();
    try {
      const apiaryEntity = await this.findEntityById(+apiaryId);
      const apiaryView = await this.apiaryService.mapToApiaryView(
        this.mapToDomainModel(apiaryEntity),
      );
      notification.addData(apiaryView);
      return notification;
    } catch (e) {
      notification.addError('Something wrong');
    }
  }

  async getAllApiary(
    paginatorParams: PaginatorInputType,
    userId: number,
  ): Promise<PaginatorViewModel<ApiaryViewModel>> {
    const { pageSize, pageNumber } = paginatorParams;
    console.log('t55');
    console.log(userId);
    const [apiaryEntities, totalCount] = await this.findEntities(
      paginatorParams,
      userId,
    );
    const items = apiaryEntities.map((a) =>
      this.apiaryService.mapToApiaryView(this.mapToDomainModel(a)),
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
    return this.mapToDomainModel(apiaryEntity);
  }

  private mapToDomainModel(apiaryEntity: ApiaryEntity) {
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

  async doesPostIdExist(apiaryId: number) {
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
