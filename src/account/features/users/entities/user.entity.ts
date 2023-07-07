import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeviceSessionsEntity } from './device-sessions.entity';
import { PasswordRecoveryInformationEntity } from './password-recovery-information.entity';
import { User } from '../domain/user';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, collation: 'C' })
  login: string;
  @Column({ unique: true, collation: 'C' })
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  passwordSalt: string;
  @Column({ type: 'bigint' })
  createdAt: number;
  @Column({ default: false })
  isBanned: boolean;
  @Column({ type: 'bigint', nullable: true })
  banDate: number | null;
  @Column({ nullable: true })
  banReason: string | null;
  @Column({ default: false })
  isConfirmed: boolean;
  @Column({ nullable: true })
  confirmationCode: string | null;
  @Column({ type: 'bigint', nullable: true })
  expirationDate: number | null;
  @Column({ type: 'bigint', nullable: true })
  dateSendingConfirmEmail: number | null;
  @OneToOne(() => PasswordRecoveryInformationEntity, (pri) => pri.user)
  passwordRecoveryInformation: PasswordRecoveryInformationEntity;
  @OneToMany(() => DeviceSessionsEntity, (ds) => ds.user)
  deviceSessions: DeviceSessionsEntity[];

  toDomain() {
    console.log('castToUserModel');
    const user = new User();
    user.id = String(this.id);
    user.accountData = {
      login: this.login,
      email: this.email,
      passwordHash: this.passwordHash,
      passwordSalt: this.passwordSalt,
      createdAt: +this.createdAt,
    };
    user.banInfo = {
      isBanned: this.isBanned,
      banDate: +this.banDate || null,
      banReason: this.banReason,
      sa: 'superAdmin',
    };
    user.emailConfirmation = {
      isConfirmed: this.isConfirmed,
      confirmationCode: this.confirmationCode,
      expirationDate: +this.expirationDate || null,
      dateSendingConfirmEmail: +this.dateSendingConfirmEmail || null,
    };
    user.passwordRecoveryInformation = {
      recoveryCode: this.passwordRecoveryInformation?.recoveryCode,
      expirationDate: +this.passwordRecoveryInformation?.expirationDate || null,
    };
    if (this.deviceSessions && Array.isArray(this.deviceSessions)) {
      user.deviceSessions = this.deviceSessions.map((d) => ({
        deviceId: d.deviceId,
        ip: d.ip,
        title: d.title,
        lastActiveDate: +d.lastActiveDate,
        expiresDate: +d.expiresDate,
      }));
    } else user.deviceSessions = [];

    return user;
  }
}
