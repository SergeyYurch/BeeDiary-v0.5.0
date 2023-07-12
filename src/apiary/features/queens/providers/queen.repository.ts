import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { QueenQueryRepository } from './queen.query.repository';
import { QueenEntity } from '../../../entities/queen.entity';
import { Queen } from '../../../domain/queen';

export class QueenRepository {
  constructor(
    private readonly queryRepository: QueenQueryRepository,
    @InjectRepository(QueenEntity)
    private readonly entityRepository: Repository<QueenEntity>,
  ) {}
  async save(domainModel: Queen) {
    let entity = new QueenEntity();
    if (domainModel.id)
      entity = await this.queryRepository.findEntityById(+domainModel.id);
    entity.createdAt = domainModel.createdAt;
    entity.flybyMonth = domainModel.flybyMonth;
    entity.flybyYear = domainModel.flybyYear;
    entity.condition = domainModel.condition;
    entity.note = domainModel.note;
    entity.beekeeperId = +domainModel.beekeeper.id;
    entity.breedId = +domainModel.breed?.id || null;
    if (domainModel.breed === null) entity.breed = null;
    console.log('queen entity to DB', entity);
    await this.entityRepository.save(entity);
    return entity.id.toString();
  }

  async delete(id: string) {
    const res: DeleteResult = await this.entityRepository.delete(+id);
    return res.affected > 0;
  }
}
