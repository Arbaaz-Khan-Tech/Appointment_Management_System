"use client"

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

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
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clinic Dashboard</h1>
        <Image src="/logo.png" alt="Logo" width={48} height={48} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctors Column */}
        <Card className="bg-[#1c1c1c] border border-[#2c2c2c]">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Doctors Today</h2>
            {doctors.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-sm text-gray-400">{doc.specialization}</div>
                </div>
                {isDoctorAvailableToday(doc.available_from, doc.available_to) && (
                  <Badge className="bg-green-500 text-black">Available</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Queue Column */}
        <Card className="bg-[#1c1c1c] border border-[#2c2c2c]">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Current Queue</h2>
            {queue.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  #{item.queue_number} - {item.patient.name}
                </span>
                <Badge variant="outline" className="capitalize">
                  {item.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Patients Admitted Column */}
        <Card className="bg-[#1c1c1c] border border-[#2c2c2c]">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Patients Admitted Today</h2>
            <p className="text-4xl font-bold">{patientsToday.length}</p>
            <ul className="space-y-1 text-sm text-gray-300">
              {patientsToday.map((p) => (
                <li key={p.id}>• {p.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
