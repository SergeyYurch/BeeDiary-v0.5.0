import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../account/features/users/entities/user.entity';
import { Frame } from '../domain/frame';

@Entity('frames')
export class FrameEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @Column()
  type: string;
  @Column()
  width: number;
  @Column()
  height: number;
  @Column()
  cellsNumber: number;
  @ManyToOne(() => UserEntity)
  beekeeper: UserEntity;
  @Column()
  beekeeperId: number;

  toDomain(): Frame {
    const frame = new Frame();
    frame.id = this.id?.toString();
    frame.createdAt = this.createdAt;
    frame.type = this.type;
    frame.width = this.width;
    frame.height = this.height;
    frame.numberOfCells = this.cellsNumber;
    frame.beekeeper = this.beekeeper?.toDomain();
    return frame;
  }
}
