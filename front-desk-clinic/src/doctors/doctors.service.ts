import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';



@Injectable()

export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  create(dto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepo.create(dto);
    return this.doctorRepo.save(doctor);
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }

  async findOne(id: number): Promise<Doctor> {
  const doctor = await this.doctorRepo.findOne({ where: { id } });
  if (!doctor) {
    throw new NotFoundException('Doctor not found');
  }
  return doctor;
}


  async update(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    if (!doctor) throw new NotFoundException('Doctor not found');
    Object.assign(doctor, dto);
    return this.doctorRepo.save(doctor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.doctorRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Doctor not found');
  }
}
