import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('breeds')
export class BreedEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  breed: string;
}
