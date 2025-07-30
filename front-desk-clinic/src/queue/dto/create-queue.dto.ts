export class CreateQueueDto {
  patientId: number;
  status: 'waiting' | 'with_doctor' | 'completed';
}
