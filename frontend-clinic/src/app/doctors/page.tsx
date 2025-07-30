'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Doctor {
  id: number
  name: string
  specialization: string
  gender: string
  location: string
  available_from: string
  available_to: string
}

export default function DoctorPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [form, setForm] = useState<Partial<Doctor>>({})
  const [isEdit, setIsEdit] = useState(false)

  const fetchDoctors = async () => {
    const res = await api.get('/doctors')
    setDoctors(res.data)
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleSubmit = async () => {
    if (isEdit && form.id) {
      await api.patch(`/doctors/${form.id}`, form)
    } else {
      await api.post('/doctors', form)
    }
    setForm({})
    setIsEdit(false)
    fetchDoctors()
  }

  const handleDelete = async (id: number) => {
    await api.delete(`/doctors/${id}`)
    fetchDoctors()
  }

  const handleEdit = (doctor: Doctor) => {
    setForm(doctor)
    setIsEdit(true)
  }

  return (
    <div className="p-8 text-white bg-[#0f0f0f] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Doctors</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {['name', 'specialization', 'gender', 'location', 'available_from', 'available_to'].map((field) => (
          <div key={field}>
            <Label>{field.replace('_', ' ')}</Label>
            <Input
              type="text"
              value={(form as any)[field] || ''}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="bg-[#1c1c1c] border border-[#333] text-white"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} className="bg-white text-black mb-8">
        {isEdit ? 'Update Doctor' : 'Add Doctor'}
      </Button>

      <div className="space-y-2">
        {doctors.map((doc) => (
          <div key={doc.id} className="p-4 rounded-lg bg-[#1c1c1c] border border-[#333] flex justify-between items-center">
            <div>
              <div className="font-semibold">{doc.name}</div>
              <div className="text-sm text-gray-400">{doc.specialization} | {doc.location}</div>
            </div>
            <div className="space-x-2">
              <Button variant="secondary" onClick={() => handleEdit(doc)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDelete(doc.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
