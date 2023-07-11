import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { HiveQueryRepository } from './hive.query.repository';
import { HiveEntity } from '../../../entities/hive.entity';
import { Hive } from '../../../domain/hive';

export class HiveRepository {
  constructor(
    private readonly queryRepository: HiveQueryRepository,
    @InjectRepository(HiveEntity)
    private readonly entityRepository: Repository<HiveEntity>,
  ) {}
  async save(hive: Hive) {
    let hiveEntity = new HiveEntity();
    if (hive.id)
      hiveEntity = await this.queryRepository.findEntityById(+hive.id);
    hiveEntity.createdAt = hive.createdAt;
    hiveEntity.title = hive.title;
    hiveEntity.width = hive.width;
    hiveEntity.height = hive.height;
    hiveEntity.long = hive.long;
    hiveEntity.numberOfFrames = hive.numberOfFrames;
    hiveEntity.beekeeperId = +hive.beekeeper.id;
    hiveEntity.frameTypeId = +hive.frameType?.id || null;
    console.log('hiveEntity', hiveEntity);
    await this.entityRepository.save(hiveEntity);
    return hiveEntity.id.toString();
  }

  async delete(id: string) {
    const res: DeleteResult = await this.entityRepository.delete(+id);
    return res.affected > 0;
  }
}
