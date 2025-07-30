'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('All fields are required')
      return
    }

    try {
      await api.post('/users', { name, email, password })
      router.push('/login')
    } catch (err: any) {
      setError('Registration failed')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-4 font-sans">
      <Card className="w-full max-w-lg p-8 rounded-3xl shadow-[8px_8px_20px_#0a0a0a,_-8px_-8px_20px_#1a1a1a] bg-[#1c1c1c] border border-[#2c2c2c]">
        <CardContent className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Create an Account</h2>

          {error && (
            <div className="bg-red-500/20 text-red-400 text-sm rounded-md px-4 py-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-md">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="bg-[#1c1c1c] border border-[#333] text-white placeholder:text-gray-400 text-md px-4 py-2 rounded-lg shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-md">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-[#1c1c1c] border border-[#333] text-white placeholder:text-gray-400 text-md px-4 py-2 rounded-lg shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-md">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#1c1c1c] border border-[#333] text-white placeholder:text-gray-400 text-md px-4 py-2 rounded-lg shadow-inner"
            />
          </div>

          <Button onClick={handleRegister} className="w-full mt-4 text-md font-medium bg-white text-black hover:bg-gray-100 rounded-xl py-2">
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
