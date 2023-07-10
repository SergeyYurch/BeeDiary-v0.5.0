import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { pagesCount } from '../../../../common/helpers/helpers';
import { PaginatorViewModel } from '../../../../common/dto/view-models/paginator.view.model';
import { HiveService } from './hive.service';
import { HiveEntity } from '../../../entities/hive.entity';
import { HiveViewModel } from '../dto/view/hive.view.model';
import { Hive } from '../../../domain/hive';
import { BaseQueryRepository } from '../../frames/providers/base.query.repository';

export class HiveQueryRepository extends BaseQueryRepository {
  constructor(
    @InjectRepository(HiveEntity)
    private readonly entityRepository: Repository<HiveEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly service: HiveService,
  ) {
    super();
  }

  async findEntityById(id: number): Promise<HiveEntity> {
    return this.entityRepository.findOne({
      relations: { beekeeper: true, frameType: true },
      where: { id },
    });
  }

  async getAllDomainModels(
    paginatorParams: PaginatorInputType,
    userId: string,
  ): Promise<PaginatorViewModel<HiveViewModel>> {
    const { pageSize, pageNumber } = paginatorParams;
    const [entities, totalCount] = await this.entityRepository.findAndCount({
      relations: { beekeeper: true, frameType: true },
      where: { beekeeperId: +userId },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
    });
    const domainModels = entities.map((e) => e.toDomain());
    const items = domainModels.map((dm) => this.service.getViewModel(dm));
    return {
      pagesCount: pagesCount(totalCount, pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  async getDomainModel(id: string): Promise<Hive> {
    const entity = await this.findEntityById(+id);
    if (!entity) return null;
    return entity.toDomain();
  }

  async doesIdExist(id: number): Promise<boolean> {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM hives WHERE id=${id});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, id: string): Promise<boolean> {
    const queryString = `SELECT h."beekeeperId"=${+userId} as "isOwner" FROM haves h WHERE h.id=${+id};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
