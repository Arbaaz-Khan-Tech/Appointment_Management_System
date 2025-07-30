import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Doctor } from 'src/doctors/doctor.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  create(dto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepo.create(dto);
    return this.patientRepo.save(patient);
  }

  findAll(): Promise<Patient[]> {
    return this.patientRepo.find();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({ where: { id } });
    
    if (!patient){
        throw new NotFoundException('Patinets not found')

    }
    return patient;
  }

  async update(id: number, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    if (!patient) throw new NotFoundException('Patient not found');
    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  async remove(id: number): Promise<void> {
    const result = await this.patientRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Patient not found');
  }
}
