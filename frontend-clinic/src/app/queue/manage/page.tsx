'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Clock, UserPlus, RefreshCw, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Patient {
  id: number
  name: string
  phone: string
}

interface QueueItem {
  id: number
  queue_number: number
  status: 'waiting' | 'with_doctor' | 'completed'
  patient: Patient
  created_at: string
}

export default function QueueManagePage() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fetchQueue = async () => {
    try {
      const res = await api.get('/queue')
      setQueue(res.data)
    } catch (error) {
      console.error('Error fetching queue:', error)
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients')
      setPatients(res.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  useEffect(() => {
    fetchQueue()
    fetchPatients()
  }, [])

  const addToQueue = async () => {
    if (!selectedPatientId) return
    
    setIsLoading(true)
    try {
      await api.post('/queue', {
        patientId: selectedPatientId,
        status: 'waiting'
      })
      fetchQueue()
      setSelectedPatientId(null)
    } catch (error) {
      console.error('Error adding to queue:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQueueStatus = async (id: number, status: 'waiting' | 'with_doctor' | 'completed') => {
    setIsLoading(true)
    try {
      await api.patch(`/queue/${id}`, { status })
      fetchQueue()
    } catch (error) {
      console.error('Error updating queue status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromQueue = async (id: number) => {
    setIsLoading(true)
    try {
      await api.delete(`/queue/${id}`)
      fetchQueue()
    } catch (error) {
      console.error('Error removing from queue:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full border-0 capitalize">{status}</Badge>
      case 'with_doctor':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full border-0 capitalize">{status.replace('_', ' ')}</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full border-0 capitalize">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-8 text-green-900 bg-green-100 min-h-screen">
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6">
        <h1 className="text-2xl font-bold text-green-700">Queue Management</h1>
        <Button 
          variant="outline" 
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-lg gap-2"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add to Queue Card */}
        <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-green-100 pb-3">
              <UserPlus className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-green-700">Add to Queue</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-green-700 mb-2 block">Select Patient</Label>
                <Select 
                  value={selectedPatientId?.toString() || ''} 
                  onValueChange={(value) => setSelectedPatientId(parseInt(value))}
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
              
              <Button 
                onClick={addToQueue} 
                disabled={!selectedPatientId || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg gap-2"
              >
                <Clock className="h-4 w-4" />
                Add to Queue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Queue Card */}
        <Card className="bg-white border border-green-100 rounded-xl shadow-md overflow-hidden md:col-span-2">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-green-100 pb-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-700">Current Queue</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchQueue} 
                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {queue.length === 0 ? (
                <p className="text-green-500 text-center py-4">No patients in queue</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {queue.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-green-50 border border-green-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-green-800 text-lg">#{item.queue_number}</span>
                          <span className="font-medium text-green-800">{item.patient.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-green-600">{item.patient.phone}</span>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.status === 'waiting' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQueueStatus(item.id, 'with_doctor')} 
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg"
                          >
                            With Doctor
                          </Button>
                        )}
                        {item.status === 'with_doctor' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQueueStatus(item.id, 'completed')} 
                            className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeFromQueue(item.id)} 
                          className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}