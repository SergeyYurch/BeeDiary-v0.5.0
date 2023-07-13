import { HiveEntity } from './hive.entity';
import { FrameEntity } from './frame.entity';
import { QueenEntity } from './queen.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../account/features/users/entities/user.entity';

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
}
