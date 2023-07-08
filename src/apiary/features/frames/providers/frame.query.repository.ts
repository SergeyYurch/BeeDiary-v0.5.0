import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { FrameEntity } from '../../../entities/frame.entity';

export class FrameQueryRepository {
  constructor(
    @InjectRepository(FrameEntity)
    private readonly frameEntityRepository: Repository<FrameEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findEntityById(id: number) {
    return this.frameEntityRepository.findOne({
      relations: { beekeeper: true },
      where: { id },
    });
  }

  async getAllBreeds(paginatorParams: PaginatorInputType) {
    const { pageSize, pageNumber } = paginatorParams;
    const [entities, count] = await this.frameEntityRepository.findAndCount({
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
    });
    return {
      pageNumber,
      pageSize,
      count,
      breeds: entities.map((e) => e.toDomain()),
    };
  }
  async getFrame(id: string) {
    const entity: FrameEntity = await this.findEntityById(+id);
    if (!entity) return null;
    console.log('Frame entity', entity);
    return entity.toDomain();
  }

  async doesIdExist(id: number) {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM frames WHERE id=${id});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, id: string) {
    const queryString = `SELECT f."beekeeperId"=${+userId} as "isOwner" FROM frames f WHERE f.id=${+id};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
