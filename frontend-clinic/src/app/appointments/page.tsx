'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, UserRound, Users, Check, X, Edit2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Patient {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'canceled';
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editAppointmentId, setEditAppointmentId] = useState<number | null>(null);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Error loading appointments. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  // Create appointment
  const createAppointment = async () => {
    if (!selectedPatientId || !selectedDoctorId || !appointmentDate || !appointmentTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/appointments', {
        patientId: selectedPatientId,
        doctorId: selectedDoctorId,
        date: appointmentDate,
        time: appointmentTime,
        status: 'booked'
      });

      // Reset form
      setSelectedPatientId(null);
      setSelectedDoctorId(null);
      setAppointmentDate('');
      setAppointmentTime('');
      
      // Refresh appointments
      fetchAppointments();
      setError(null);
    } catch (err) {
      setError('Error creating appointment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment
  const updateAppointment = async () => {
    if (!editAppointmentId || !appointmentDate || !appointmentTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/appointments/${editAppointmentId}`, {
        date: appointmentDate,
        time: appointmentTime
      });

      // Reset form and exit edit mode
      setEditMode(false);
      setEditAppointmentId(null);
      setAppointmentDate('');
      setAppointmentTime('');
      
      // Refresh appointments
      fetchAppointments();
      setError(null);
    } catch (err) {
      setError('Error updating appointment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id: number, status: 'completed' | 'canceled') => {
    try {
      setLoading(true);
      await api.patch(`/appointments/${id}`, { status });
      
      // Refresh appointments
      fetchAppointments();
      setError(null);
    } catch (err) {
      setError(`Error ${status === 'completed' ? 'completing' : 'canceling'} appointment. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment
  const deleteAppointment = async (id: number) => {
    try {
      setLoading(true);
      await api.delete(`/appointments/${id}`);
      
      // Refresh appointments
      fetchAppointments();
      setError(null);
    } catch (err) {
      setError('Error deleting appointment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Set up edit mode
  const startEditMode = (appointment: Appointment) => {
    setEditMode(true);
    setEditAppointmentId(appointment.id);
    setAppointmentDate(appointment.date);
    setAppointmentTime(appointment.time);
  };

  // Cancel edit mode
  const cancelEditMode = () => {
    setEditMode(false);
    setEditAppointmentId(null);
    setAppointmentDate('');
    setAppointmentTime('');
  };

  // Load data on component mount
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full border-0 capitalize">{status}</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full border-0 capitalize">{status}</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 rounded-full border-0 capitalize">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="bg-white text-green-700 border-green-200 hover:bg-green-50 rounded-lg"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-green-800">Appointments</h1>
        </div>
        <Button 
          variant="outline" 
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-lg gap-2"
          onClick={fetchAppointments}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointment Form Card */}
        <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-green-100 pb-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-green-700">
                {editMode ? 'Update Appointment' : 'Book Appointment'}
              </h2>
            </div>
            
            <div className="space-y-4">
              {!editMode && (
                <>
                  <div className="space-y-2">
                    <Label className="text-green-700">Patient</Label>
                    <Select 
                      value={selectedPatientId?.toString() || ''}
                      onValueChange={(value) => setSelectedPatientId(Number(value))}
                      disabled={editMode}
                    >
                      <SelectTrigger className="bg-green-50 border-green-200 text-green-800 rounded-lg focus:ring-green-500 focus:border-green-500">
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-700">Doctor</Label>
                    <Select 
                      value={selectedDoctorId?.toString() || ''}
                      onValueChange={(value) => setSelectedDoctorId(Number(value))}
                      disabled={editMode}
                    >
                      <SelectTrigger className="bg-green-50 border-green-200 text-green-800 rounded-lg focus:ring-green-500 focus:border-green-500">
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.name} - {doctor.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-green-700">Date</Label>
                <Input 
                  type="date" 
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="bg-green-50 border-green-200 text-green-800 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-700">Time</Label>
                <Input 
                  type="time" 
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="bg-green-50 border-green-200 text-green-800 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editMode ? (
                  <>
                    <Button 
                      onClick={updateAppointment}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      disabled={loading}
                    >
                      Update Appointment
                    </Button>
                    <Button 
                      onClick={cancelEditMode}
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 rounded-lg"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={createAppointment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    disabled={loading || !selectedPatientId || !selectedDoctorId || !appointmentDate || !appointmentTime}
                  >
                    Book Appointment
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List Card */}
        <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden md:col-span-2">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-green-100 pb-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-700">Appointments</h2>
              </div>
              <Badge className="bg-green-100 text-green-700 rounded-full px-3 py-1">
                {appointments.length} {appointments.length === 1 ? 'Appointment' : 'Appointments'}
              </Badge>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {loading && appointments.length === 0 ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 text-green-500 animate-spin mx-auto" />
                  <p className="text-green-600 mt-2">Loading appointments...</p>
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-green-500 text-center py-4">No appointments scheduled</p>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-green-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-green-600" />
                          <h3 className="font-semibold text-green-900">{appointment.patient.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">{appointment.doctor.name} - {appointment.doctor.specialization}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">{formatDate(appointment.date)} at {appointment.time}</span>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-green-200">
                      {appointment.status === 'booked' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
                            onClick={() => startEditMode(appointment)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                            onClick={() => updateAppointmentStatus(appointment.id, 'canceled')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}