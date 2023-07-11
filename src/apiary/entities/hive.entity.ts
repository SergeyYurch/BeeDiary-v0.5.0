import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../account/features/users/entities/user.entity';
import { FrameEntity } from './frame.entity';
import { Hive } from '../domain/hive';

@Entity('hives')
export class HiveEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @Column()
  title: string;
  @Column()
  width: number;
  @Column()
  height: number;
  @Column()
  long: number;
  @Column()
  numberOfFrames: number;
  @ManyToOne(() => FrameEntity, { nullable: true })
  frameType: FrameEntity | null;
  @Column({ nullable: true })
  frameTypeId: number | null;
  @ManyToOne(() => UserEntity)
  beekeeper: UserEntity;
  @Column()
  beekeeperId: number;

  toDomain(): Hive {
    const hive = new Hive();
    hive.id = this.id?.toString();
    hive.createdAt = this.createdAt;
    hive.title = this.title;
    hive.width = this.width;
    hive.height = this.height;
    hive.long = this.long;
    hive.numberOfFrames = this.numberOfFrames;
    hive.frameType = this.frameType?.toDomain() ?? null;
    hive.beekeeper = this.beekeeper.toDomain();
    return hive;
  }
}
