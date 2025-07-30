export class CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  status: 'booked';
}
