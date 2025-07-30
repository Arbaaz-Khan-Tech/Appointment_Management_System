import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Patient } from '../patients/patient.entity';

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @Column()
  queue_number: number;

  @Column()
  status: 'waiting' | 'with_doctor' | 'completed';

  @CreateDateColumn()
  created_at: Date;
}
