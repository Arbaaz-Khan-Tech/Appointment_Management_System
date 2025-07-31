'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Save, Trash2, Edit2, ArrowLeft, UserPlus, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Patient {
  id: number
  name: string
  phone: string
}

export default function PatientPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [form, setForm] = useState<Partial<Patient>>({})
  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()

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
    <div className="p-8 text-green-900 bg-green-100 min-h-screen">
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6">
        <h1 className="text-2xl font-bold text-green-700">Patients Management</h1>
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
            <UserPlus className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">{isEdit ? 'Edit Patient' : 'Add New Patient'}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-green-700 mb-1 flex items-center gap-2">
                <Users className="h-4 w-4" /> Name
              </Label>
              <Input
                type="text"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-green-50 border border-green-200 text-green-800 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Patient name"
              />
            </div>
            <div>
              <Label className="text-green-700 mb-1 flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone
              </Label>
              <Input
                type="text"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-green-50 border border-green-200 text-green-800 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg gap-2"
            >
              <Save className="h-4 w-4" />
              {isEdit ? 'Update Patient' : 'Add Patient'}
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
            <Users className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">Patient List</h2>
          </div>
          
          <div className="space-y-3">
            {patients.length === 0 ? (
              <p className="text-green-500 text-center py-4">No patients available</p>
            ) : (
              patients.map((p) => (
                <div key={p.id} className="p-4 rounded-lg bg-green-50 border border-green-100 flex justify-between items-center hover:shadow-sm transition-all">
                  <div>
                    <div className="font-semibold text-green-800">{p.name}</div>
                    <div className="text-sm text-green-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {p.phone}
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEdit(p)} 
                      className="border-green-200 text-green-700 hover:bg-green-100 rounded-lg"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDelete(p.id)} 
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
