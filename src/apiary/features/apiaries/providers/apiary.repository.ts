import { Apiary } from '../../../domain/apiary';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ApiaryEntity } from '../../../entities/apiary.entity';
import { ApiaryQueryRepository } from './apiary.query.repository';

export class ApiaryRepository {
  constructor(
    private apiaryQueryRepository: ApiaryQueryRepository,
    @InjectRepository(ApiaryEntity)
    private readonly apiaryRepository: Repository<ApiaryEntity>,
  ) {}
  async save(apiary: Apiary) {
    let apiaryEntity: ApiaryEntity;
    if (!apiary.id) apiaryEntity = new ApiaryEntity();
    if (apiary.id)
      apiaryEntity = await this.apiaryQueryRepository.findEntityById(
        +apiary.id,
      );
    apiaryEntity.createdAt = apiary.createdAt;
    apiaryEntity.type = apiary.type;
    apiaryEntity.location = apiary.location;
    apiaryEntity.schema = apiary.schema || null;
    apiaryEntity.disbandedAt = apiary.disbandedAt || null;
    apiaryEntity.note = apiary.note;
    apiaryEntity.beekeeperId = +apiary.beekeeper.id;
    await this.apiaryRepository.save(apiaryEntity);
    console.log(apiaryEntity);
    return apiaryEntity.id.toString();
  }

  async delete(apiaryId: number) {
    const res: DeleteResult = await this.apiaryRepository.delete(apiaryId);
    return res.affected > 0;
  }
}
