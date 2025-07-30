import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Patient } from '../patients/patient.entity';
import { Doctor } from '../doctors/doctor.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
    const doctor = await this.doctorRepo.findOne({ where: { id: dto.doctorId } });

    if (!patient) throw new NotFoundException('Patient not found');
    if (!doctor) throw new NotFoundException('Doctor not found');

    const appointment = this.appointmentRepo.create({
      patient,
      doctor,
      date: dto.date,
      time: dto.time,
      status: 'booked',
    });

    return this.appointmentRepo.save(appointment);
  }

  findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find({ order: { date: 'ASC', time: 'ASC' } });
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    Object.assign(appointment, dto);
    return this.appointmentRepo.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Appointment not found');
  }
}
