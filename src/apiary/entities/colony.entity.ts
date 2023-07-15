import { HiveEntity } from './hive.entity';
import { FrameEntity } from './frame.entity';
import { QueenEntity } from './queen.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../account/features/users/entities/user.entity';
import { Colony } from '../domain/colony';

@Entity('colonies')
export class ColonyEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @Column()
  number: number;
  @ManyToOne(() => HiveEntity)
  hive: HiveEntity;
  @Column()
  hiveId: number;
  @ManyToOne(() => FrameEntity)
  nestFrameType: FrameEntity;
  @Column()
  nestFrameTypeId: number;
  @ManyToOne(() => QueenEntity)
  queen: QueenEntity;
  @Column()
  queenId: number;
  @Column()
  condition: number;
  @Column()
  note: string;
  @Column()
  status: number;
  @ManyToOne(() => UserEntity)
  beekeeper: UserEntity;
  @Column()
  beekeeperId: number;

  toDomain() {
    const colony = new Colony();
    colony.id = this.id?.toString();
    colony.createdAt = this.createdAt;
    colony.number = this.number;
    colony.hive = this.hive?.toDomain() ?? null;
    colony.nestFrameType = this.nestFrameType?.toDomain() ?? null;
    colony.queen = this.queen?.toDomain() ?? null;
    colony.condition = this.condition;
    colony.note = this.note;
    colony.status = this.status;
    colony.beekeeper = this.beekeeper?.toDomain() ?? null;
    return colony;
  }
}
