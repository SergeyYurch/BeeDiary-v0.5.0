import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ColonyQueryRepository } from './colony.query.repository';
import { ColonyEntity } from '../../../entities/colony.entity';
import { Colony } from '../../../domain/colony';

export class ColonyRepository {
  constructor(
    private readonly queryRepository: ColonyQueryRepository,
    @InjectRepository(ColonyEntity)
    private readonly entityRepository: Repository<ColonyEntity>,
  ) {}
  async save(domainModel: Colony) {
    console.log('Colony domain:', domainModel);
    let entity = new ColonyEntity();
    if (domainModel.id)
      entity = await this.queryRepository.findEntityById(+domainModel.id);
    entity.createdAt = domainModel.createdAt;
    entity.number = domainModel.number;
    entity.hiveId = +domainModel.hive?.id;
    entity.nestFrameTypeId = +domainModel.nestFrameType?.id;
    entity.queenId = +domainModel.queen?.id;
    entity.condition = domainModel.condition;
    entity.note = domainModel.note;
    entity.status = domainModel.status;
    entity.beekeeperId = +domainModel.beekeeper?.id;
    if (!domainModel.hive) entity.hive = null;
    if (!domainModel.nestFrameType) entity.nestFrameType = null;
    if (!domainModel.queen) entity.queen = null;
    await this.entityRepository.save(entity);
    return entity.id.toString();
  }

  async delete(id: string) {
    const res: DeleteResult = await this.entityRepository.delete(+id);
    return res.affected > 0;
  }
}
