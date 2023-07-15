import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Breed } from '../domain/breed';
import { UserEntity } from '../../account/features/users/entities/user.entity';

@Entity('breeds')
export class BreedEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  createdAt: Date;
  @ManyToOne(() => UserEntity)
  beekeeper: UserEntity;
  @Column()
  beekeeperId: number;

  toDomain(): Breed {
    const breed = new Breed();
    breed.id = this.id.toString();
    breed.title = this.title;
    breed.createdAt = this.createdAt;
    breed.beekeeper = this.beekeeper?.toDomain() ?? null;
    return breed;
  }
}
