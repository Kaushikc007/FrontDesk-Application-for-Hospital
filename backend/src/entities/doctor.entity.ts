import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from './appointment.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum DoctorStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  BREAK = 'break',
  INACTIVE = 'inactive',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  specialization: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  availability: string; // JSON string for availability schedule

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: DoctorStatus,
    default: DoctorStatus.ACTIVE,
  })
  status: DoctorStatus;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
