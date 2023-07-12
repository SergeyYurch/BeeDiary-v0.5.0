import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { BreedEntity } from '../../../entities/breed.entity';

export class BreedQueryRepository {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findEntityById(id: number) {
    return this.breedEntityRepository.findOne({
      relations: { beekeeper: true },
      where: { id },
    });
  }

  async getAllBreeds(paginatorParams: PaginatorInputType) {
    const { pageSize, pageNumber } = paginatorParams;
    const [entities, count] = await this.breedEntityRepository.findAndCount({
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
  async getDomainModel(id: string) {
    const entity: BreedEntity = await this.findEntityById(+id);
    if (!entity) return null;
    console.log('Breed entity', entity);
    return entity.toDomain();
  }

  async doesIdExist(id: number) {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM breeds WHERE id=${id});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, id: string) {
    const queryString = `SELECT b."beekeeperId"=${+userId} as "isOwner" FROM breeds b WHERE b.id=${+id};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
