import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { pagesCount } from '../../../../common/helpers/helpers';
import { PaginatorViewModel } from '../../../../common/dto/view-models/paginator.view.model';
import { QueenService } from './queen.service';
import { BaseQueryRepository } from '../../frames/providers/base.query.repository';
import { QueenEntity } from '../../../entities/queen.entity';
import { QueenViewModel } from '../dto/view/queen.view.model';
import { Queen } from '../../../domain/queen';

export class QueenQueryRepository extends BaseQueryRepository {
  constructor(
    @InjectRepository(QueenEntity)
    private readonly entityRepository: Repository<QueenEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly service: QueenService,
  ) {
    super();
  }

  async findEntityById(id: number): Promise<QueenEntity> {
    return this.entityRepository.findOne({
      relations: { beekeeper: true, breed: { beekeeper: true } },
      where: { id },
    });
  }

  async getAllDomainModels(
    paginatorParams: PaginatorInputType,
    userId: string,
  ): Promise<PaginatorViewModel<QueenViewModel>> {
    const { pageSize, pageNumber } = paginatorParams;
    const [entities, totalCount] = await this.entityRepository.findAndCount({
      relations: { beekeeper: true, breed: { beekeeper: true } },
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

  async getDomainModel(id: string): Promise<Queen> {
    console.log(`[QueenQueryRepository]/getDomainModel by id: ${id}`);
    const entity = await this.findEntityById(+id);
    console.log(entity);
    if (!entity) return null;
    return entity.toDomain();
  }

  async doesIdExist(id: number): Promise<boolean> {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM queens WHERE id=${id});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, id: string): Promise<boolean> {
    const queryString = `SELECT q."beekeeperId"=${+userId} as "isOwner" FROM queens q WHERE q.id=${+id};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
