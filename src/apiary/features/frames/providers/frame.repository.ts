import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FrameEntity } from '../../../entities/frame.entity';
import { Frame } from '../../../domain/frame';
import { FrameQueryRepository } from './frame.query.repository';

export class FrameRepository {
  constructor(
    private readonly queryRepository: FrameQueryRepository,
    @InjectRepository(FrameEntity)
    private readonly frameEntityRepository: Repository<FrameEntity>,
  ) {}
  async save(frame: Frame) {
    let frameEntity = new FrameEntity();
    if (frame.id)
      frameEntity = await this.queryRepository.findEntityById(+frame.id);
    frameEntity.createdAt = frame.createdAt;
    frameEntity.type = frame.type;
    frameEntity.width = frame.width;
    frameEntity.height = frame.height;
    frameEntity.cellsNumber = frame.numberOfCells;
    frameEntity.beekeeperId = +frame.beekeeper.id;
    await this.frameEntityRepository.save(frameEntity);
    return frameEntity.id.toString();
  }

  async delete(id: string) {
    const res: DeleteResult = await this.frameEntityRepository.delete(+id);
    return res.affected > 0;
  }
}
