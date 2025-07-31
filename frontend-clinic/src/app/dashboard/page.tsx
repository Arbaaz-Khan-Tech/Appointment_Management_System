"use client"

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { UserRound, Users, Clock, PlusCircle, UserPlus, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  location: string;
  available_from: string;
  available_to: string;
}

interface QueueItem {
  id: number;
  queue_number: number;
  status: string;
  patient: {
    name: string;
  };
}

interface Patient {
  id: number;
  name: string;
  created_at: string;
}

export default function DashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [patientsToday, setPatientsToday] = useState<Patient[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];

      const [doctorsRes, queueRes, patientsRes] = await Promise.all([
        api.get("/doctors"),
        api.get("/queue"),
        api.get("/patients"),
      ]);

      setDoctors(doctorsRes.data);
      setQueue(queueRes.data);

      const todayPatients = patientsRes.data.filter((p: Patient) => {
        const created = new Date(p.created_at).toISOString().split("T")[0];
        return created === today;
      });
      setPatientsToday(todayPatients);
    };

    fetchData();
  }, []);

  const isDoctorAvailableToday = (from: string, to: string) => {
    const now = new Date();
    const [fromH, fromM] = from.split(":").map(Number);
    const [toH, toM] = to.split(":").map(Number);
    const start = new Date();
    const end = new Date();
    start.setHours(fromH, fromM);
    end.setHours(toH, toM);
    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-green-100 text-green-900 p-6 space-y-8">
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-green-100">
        <h1 className="text-3xl font-bold text-green-700">Clinic Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-lg gap-2"
            onClick={() => router.push('/doctors')}
          >
            <UserPlus className="h-4 w-4" />
            Add Doctor
          </Button>
          <Button 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-lg gap-2"
            onClick={() => router.push('/patients')}
          >
            <PlusCircle className="h-4 w-4" />
            Add Patient
          </Button>
          <Button 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-lg gap-2"
            onClick={() => router.push('/queue/manage')}
          >
            <Clock className="h-4 w-4" />
            Manage Queue
          </Button>
          <Button 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-lg gap-2"
            onClick={() => router.push('/appointments')}
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Button>
          <div className="bg-green-100 p-2 rounded-full">
            <Image src="/next.svg" alt="Clinic Logo" width={40} height={40} className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Doctors Column */}
        <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-green-100 pb-3">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-700">Doctors Today</h2>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                onClick={() => router.push('/doctors')}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {doctors.length === 0 ? (
                <p className="text-green-500 text-center py-2">No doctors available</p>
              ) : (
                doctors.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center p-3 hover:bg-green-50 rounded-lg transition-colors">
                    <div>
                      <div className="font-medium text-green-800">{doc.name}</div>
                      <div className="text-sm text-green-600">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full border-0">
                          {doc.specialization}
                        </Badge>
                      </div>
                    </div>
                    {isDoctorAvailableToday(doc.available_from, doc.available_to) && (
                      <Badge className="bg-green-500 text-white hover:bg-green-600 rounded-full border-0">
                        Available
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Queue Column */}
        <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-green-100 pb-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-700">Current Queue</h2>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                onClick={() => router.push('/queue/manage')}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {queue.length === 0 ? (
                <p className="text-green-500 text-center py-2">No patients in queue</p>
              ) : (
                queue.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-3 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => router.push('/queue/manage')}
                  >
                    <span className="font-medium">
                      #{item.queue_number} - {item.patient.name}
                    </span>
                    {item.status === 'waiting' ? (
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full border-0 capitalize">
                        {item.status.replace("_", " ")}
                      </Badge>
                    ) : item.status === 'with_doctor' ? (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full border-0 capitalize">
                        {item.status.replace("_", " ")}
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full border-0 capitalize">
                        {item.status.replace("_", " ")}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patients Admitted Column */}
        <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-green-100 pb-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-700">Patients Admitted Today</h2>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                onClick={() => router.push('/patients')}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-6xl font-bold text-green-700 bg-green-50 h-24 w-24 rounded-full flex items-center justify-center mb-4">
                {patientsToday.length}
              </div>
              
              {patientsToday.length > 0 && (
                <div className="w-full max-h-[200px] overflow-y-auto p-2 space-y-2">
                  {patientsToday.map((p) => (
                    <div key={p.id} className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
