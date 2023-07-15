import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { pagesCount } from '../../../../common/helpers/helpers';
import { PaginatorViewModel } from '../../../../common/dto/view-models/paginator.view.model';
import { ColonyService } from './colony.service';
import { BaseQueryRepository } from '../../frames/providers/base.query.repository';
import { ColonyViewModel } from '../dto/view/colony.view.model';
import { Colony } from '../../../domain/colony';
import { ColonyEntity } from '../../../entities/colony.entity';

export class ColonyQueryRepository extends BaseQueryRepository {
  constructor(
    @InjectRepository(ColonyEntity)
    private readonly entityRepository: Repository<ColonyEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly service: ColonyService,
  ) {
    super();
  }

  async findEntityById(id: number): Promise<ColonyEntity> {
    return this.entityRepository.findOne({
      relations: {
        hive: { frameType: true, beekeeper: true },
        nestFrameType: true,
        queen: { breed: true },
        beekeeper: true,
      },
      where: { id },
    });
  }

  async getAllDomainModels(
    paginatorParams: PaginatorInputType,
    userId: string,
  ): Promise<PaginatorViewModel<ColonyViewModel>> {
    const { pageSize, pageNumber } = paginatorParams;
    const [entities, totalCount] = await this.entityRepository.findAndCount({
      relations: {
        hive: { frameType: true, beekeeper: true },
        nestFrameType: true,
        queen: { breed: true },
        beekeeper: true,
      },
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

  async getDomainModel(id: string): Promise<Colony> {
    console.log(`[ColonyQueryRepository]/getDomainModel by id: ${id}`);
    const entity = await this.findEntityById(+id);
    if (!entity) return null;
    return entity.toDomain();
  }

  async doesIdExist(id: number): Promise<boolean> {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM colonies WHERE id=${id});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, id: string): Promise<boolean> {
    const queryString = `SELECT c."beekeeperId"=${+userId} as "isOwner" FROM colonies c WHERE c.id=${+id};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
