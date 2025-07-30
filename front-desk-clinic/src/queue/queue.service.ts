import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { Repository } from 'typeorm';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { Patient } from '../patients/patient.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepo: Repository<Queue>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(dto: CreateQueueDto): Promise<Queue> {
  const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
  if (!patient) throw new NotFoundException('Patient not found');

  // Get the current max queue number
  const latest = await this.queueRepo
    .createQueryBuilder('queue')
    .orderBy('queue.queue_number', 'DESC')
    .limit(1)
    .getOne();

  const nextQueueNumber = latest ? latest.queue_number + 1 : 1;

  const queueEntry = this.queueRepo.create({
    patient,
    queue_number: nextQueueNumber,
    status: dto.status,
  });

  return this.queueRepo.save(queueEntry);
}


  async findAll(status?: 'waiting' | 'with_doctor' | 'completed'): Promise<Queue[]> {
  const query = this.queueRepo.createQueryBuilder('queue')
    .leftJoinAndSelect('queue.patient', 'patient')
    .orderBy('queue.queue_number', 'ASC');

  if (status) {
    query.where('queue.status = :status', { status });
  }

  return query.getMany();
}

  async update(id: number, dto: UpdateQueueDto): Promise<Queue> {
    const queueItem = await this.queueRepo.findOne({ where: { id } });
    if (!queueItem) throw new NotFoundException('Queue item not found');
    queueItem.status = dto.status;
    return this.queueRepo.save(queueItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.queueRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Queue item not found');
  }
}
