import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FrameEntity } from '../../../entities/frame.entity';
import { BaseQueryRepository } from './base.query.repository';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { Frame } from '../../../domain/frame';
import { pagesCount } from '../../../../common/helpers/helpers';
import { PaginatorViewModel } from '../../../../common/dto/view-models/paginator.view.model';
import { FrameService } from './frame.service';
import { FrameViewModel } from '../dto/view/frame.view.model';

export class FrameQueryRepository extends BaseQueryRepository {
  constructor(
    @InjectRepository(FrameEntity)
    private readonly entityRepository: Repository<FrameEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly service: FrameService,
  ) {
    super();
  }

  async findEntityById(id: number): Promise<FrameEntity> {
    return this.entityRepository.findOne({
      relations: { beekeeper: true },
      where: { id },
    });
  }

  async getAllDomainModels(
    paginatorParams: PaginatorInputType,
    userId: string,
  ): Promise<PaginatorViewModel<FrameViewModel>> {
    const { pageSize, pageNumber } = paginatorParams;
    const [entities, totalCount] = await this.entityRepository.findAndCount({
      relations: { beekeeper: true },
      where: { beekeeperId: +userId },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
    });
    const frames = entities.map((e) => e.toDomain());
    const items = frames.map((f) => this.service.getViewModel(f));
    return {
      pagesCount: pagesCount(totalCount, pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  async getDomainModel(id: string): Promise<Frame> {
    const entity: FrameEntity = await this.findEntityById(+id);
    if (!entity) return null;
    return entity.toDomain();
  }

  async doesIdExist(id: number): Promise<boolean> {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM frames WHERE id=${id});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, id: string): Promise<boolean> {
    const queryString = `SELECT f."beekeeperId"=${+userId} as "isOwner" FROM frames f WHERE f.id=${+id};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
