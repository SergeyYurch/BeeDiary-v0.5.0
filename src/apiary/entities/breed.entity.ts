import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Breed } from '../domain/breed';

@Entity('breeds')
export class BreedEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  toDomain(): Breed {
    const breed = new Breed();
    breed.id = this.id.toString();
    breed.title = this.title;
    return breed;
  }
}
