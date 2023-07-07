import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../account/features/users/entities/user.entity';
import { BreedEntity } from './breed.entity';

@Entity('queens')
export class QueenEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @Column()
  yearOfBirth: number;
  @Column()
  monthOfFlyby: number;
  @Column({ nullable: true })
  condition: number;
  @Column()
  note: string;
  @ManyToOne(() => UserEntity)
  beekeeper: UserEntity;
  @Column()
  beekeeperId: number;
  @ManyToOne(() => UserEntity)
  breed: BreedEntity;
  @Column()
  breedId: number;
}
