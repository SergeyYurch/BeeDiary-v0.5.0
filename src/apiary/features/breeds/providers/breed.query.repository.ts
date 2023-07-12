import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginatorInputType } from '../../../../common/dto/input-models/paginator.input.type';
import { BreedEntity } from '../../../entities/breed.entity';
import { PaginatorViewModel } from '../../../../common/dto/view-models/paginator.view.model';
import { BreedViewModel } from '../dto/view/breed.view.model';
import { pagesCount } from '../../../../common/helpers/helpers';
import { BreedService } from './breed.service';
import { Breed } from '../../../domain/breed';

export class BreedQueryRepository {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly service: BreedService,
  ) {}

  async findEntityById(id: number): Promise<BreedEntity> {
    return this.breedEntityRepository.findOne({
      relations: { beekeeper: true },
      where: { id },
    });
  }

  async getAllBreeds(
    paginatorParams: PaginatorInputType,
    userId: string,
  ): Promise<PaginatorViewModel<BreedViewModel>> {
    const { pageSize, pageNumber } = paginatorParams;
    const [entities, totalCount] =
      await this.breedEntityRepository.findAndCount({
        relations: { beekeeper: true },
        where: { beekeeperId: +userId },
        skip: pageSize * (pageNumber - 1),
        take: pageSize,
      });
    const domainModels = entities.map((e) => e.toDomain());
    const items = domainModels.map((b) => this.service.getViewModel(b));
    return {
      pagesCount: pagesCount(totalCount, pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }
  async getDomainModel(id: string): Promise<Breed> {
    const entity: BreedEntity = await this.findEntityById(+id);
    if (!entity) return null;
    console.log('Breed entity', entity);
    return entity.toDomain();
  }

  async doesIdExist(id: number): Promise<boolean> {
    try {
      const queryString = `SELECT EXISTS (SELECT * FROM breeds WHERE id=${id});`;
      const result = await this.dataSource.query(queryString);
      return result[0].exists;
    } catch (e) {
      console.log(e);
      throw new Error('Database query error');
    }
  }

  async isOwner(userId: string, id: string): Promise<boolean> {
    const queryString = `SELECT b."beekeeperId"=${+userId} as "isOwner" FROM breeds b WHERE b.id=${+id};`;
    const result = await this.dataSource.query(queryString);
    return result[0].isOwner;
  }
}
