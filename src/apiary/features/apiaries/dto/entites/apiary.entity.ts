import { ApiaryType } from '../../../../domain/apiary';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../../../../account/features/users/entities/user.entity';

@Entity('apiaries')
export class ApiaryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  createdAt: Date;
  @Column()
  type: ApiaryType;
  @Column()
  location: string;
  @Column({ nullable: true })
  schema: string;
  @Column({ nullable: true })
  disbandedAt: Date;
  @Column()
  note: string;
  @ManyToOne(() => UserEntity)
  beekeeper: UserEntity;
  @Column()
  beekeeperId: number;
}
