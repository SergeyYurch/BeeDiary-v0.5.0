import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../account/features/users/entities/user.entity';
import { BreedEntity } from './breed.entity';
import { Queen } from '../domain/queen';

@Entity('queens')
export class QueenEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @ManyToOne(() => BreedEntity, { nullable: true })
  breed: BreedEntity | null;
  @Column({ nullable: true })
  breedId: number | null;
  @Column({ nullable: true })
  flybyMonth: number | null;
  @Column({ nullable: true })
  flybyYear: number | null;
  @Column({ nullable: true })
  condition: number | null;
  @Column({ nullable: true })
  note: string | null;
  @ManyToOne(() => UserEntity)
  beekeeper: UserEntity;
  @Column()
  beekeeperId: number;
  toDomain(): Queen {
    const queen = new Queen();
    queen.id = this.id.toString();
    queen.createdAt = this.createdAt;
    queen.breed = this.breed.toDomain();
    queen.flybyMonth = this.flybyMonth;
    queen.flybyYear = this.flybyYear;
    queen.condition = this.condition;
    queen.note = this.note;
    queen.beekeeper = this.beekeeper.toDomain();
    return queen;
  }
  // @ManyToOne(() => GraftingEntity, { nullable: true })
  //  grafting: GraftingEntity| null;
  // @Column{ nullable: true })
  //  graftingId: string | null;
}
