export class UpdateAppointmentDto {
  date?: string;
  time?: string;
  status?: 'booked' | 'completed' | 'canceled';
}
