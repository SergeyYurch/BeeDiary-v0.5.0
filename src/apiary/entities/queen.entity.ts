import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../account/features/users/entities/user.entity';
import { BreedEntity } from './breed.entity';

@Entity('queens')
export class QueenEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @ManyToOne(() => UserEntity, { nullable: true })
  breed: BreedEntity;
  @Column({ nullable: true })
  breedId: number;
  @Column({ nullable: true })
  flybyMonth: number | null;
  @Column({ nullable: true })
  flybyYear: number | null;
  @Column({ nullable: true })
  condition: number | null;
  @Column({ nullable: true })
  note: string | null;
  @ManyToOne(() => UserEntity, { nullable: true })
  beekeeper: UserEntity;
  @Column({ nullable: true })
  beekeeperId: number;

  // @ManyToOne(() => GraftingEntity, { nullable: true })
  //  grafting: GraftingEntity| null;
  // @Column{ nullable: true })
  //  graftingId: string | null;
}
