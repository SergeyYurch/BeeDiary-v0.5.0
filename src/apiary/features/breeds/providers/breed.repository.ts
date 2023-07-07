import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Breed } from '../../../domain/breed';
import { BreedEntity } from '../../../entities/breed.entity';
import { BreedQueryRepository } from './breed.query.repository';

export class BreedRepository {
  constructor(
    private readonly breedQueryRepository: BreedQueryRepository,
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
  ) {}
  async save(breed: Breed) {
    let breedEntity = new BreedEntity();
    if (breed.id)
      breedEntity = await this.breedQueryRepository.findEntityById(+breed.id);
    breedEntity.title = breed.title;
    breedEntity.beekeeperId = +breed.beekeeper.id;
    await this.breedEntityRepository.save(breedEntity);
    return breedEntity.id.toString();
  }

  async delete(id: string) {
    const res: DeleteResult = await this.breedEntityRepository.delete(+id);
    return res.affected > 0;
  }
}
