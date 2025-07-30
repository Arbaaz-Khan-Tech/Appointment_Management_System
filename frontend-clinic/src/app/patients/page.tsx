'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Patient {
  id: number
  name: string
  phone: string
}

export default function PatientPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [form, setForm] = useState<Partial<Patient>>({})
  const [isEdit, setIsEdit] = useState(false)

  const fetchPatients = async () => {
    const res = await api.get('/patients')
    setPatients(res.data)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleSubmit = async () => {
    if (isEdit && form.id) {
      await api.patch(`/patients/${form.id}`, form)
    } else {
      await api.post('/patients', form)
    }
    setForm({})
    setIsEdit(false)
    fetchPatients()
  }

  const handleDelete = async (id: number) => {
    await api.delete(`/patients/${id}`)
    fetchPatients()
  }

  const handleEdit = (p: Patient) => {
    setForm(p)
    setIsEdit(true)
  }

  return (
    <div className="p-8 text-white bg-[#0f0f0f] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Patients</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Name</Label>
          <Input
            type="text"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-[#1c1c1c] border border-[#333] text-white"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            type="text"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-[#1c1c1c] border border-[#333] text-white"
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="bg-white text-black mb-8">
        {isEdit ? 'Update Patient' : 'Add Patient'}
      </Button>

      <div className="space-y-2">
        {patients.map((p) => (
          <div key={p.id} className="p-4 rounded-lg bg-[#1c1c1c] border border-[#333] flex justify-between items-center">
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-400">{p.phone}</div>
            </div>
            <div className="space-x-2">
              <Button variant="secondary" onClick={() => handleEdit(p)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
