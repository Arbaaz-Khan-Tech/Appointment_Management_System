'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { UserRound, Save, Trash2, Edit2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

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
    <div className="p-8 text-green-900 bg-green-100 min-h-screen">
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6">
        <h1 className="text-2xl font-bold text-green-700">Doctors Management</h1>
        <Button 
          variant="outline" 
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-lg gap-2"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 border-b border-green-100 pb-3 mb-6">
            <UserRound className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {['name', 'specialization', 'gender', 'location', 'available_from', 'available_to'].map((field) => (
              <div key={field}>
                <Label className="text-green-700 mb-1">{field.replace('_', ' ')}</Label>
                <Input
                  type={field.includes('available') ? 'time' : 'text'}
                  value={(form as any)[field] || ''}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="bg-green-50 border border-green-200 text-green-800 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg gap-2"
            >
              <Save className="h-4 w-4" />
              {isEdit ? 'Update Doctor' : 'Add Doctor'}
            </Button>
            
            {isEdit && (
              <Button 
                variant="outline" 
                onClick={() => {setForm({}); setIsEdit(false);}} 
                className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 border-b border-green-100 pb-3 mb-6">
            <UserRound className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">Doctor List</h2>
          </div>
          
          <div className="space-y-3">
            {doctors.length === 0 ? (
              <p className="text-green-500 text-center py-4">No doctors available</p>
            ) : (
              doctors.map((doc) => (
                <div key={doc.id} className="p-4 rounded-lg bg-green-50 border border-green-100 flex justify-between items-center hover:shadow-sm transition-all">
                  <div>
                    <div className="font-semibold text-green-800">{doc.name}</div>
                    <div className="text-sm text-green-600">{doc.specialization} | {doc.location}</div>
                    <div className="text-xs text-green-500">Available: {doc.available_from} - {doc.available_to}</div>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEdit(doc)} 
                      className="border-green-200 text-green-700 hover:bg-green-100 rounded-lg"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDelete(doc.id)} 
                      className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
