'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

const handleLogin = async () => {
  console.log('Sending:', { email, password }) // ✅ log input values

  if (!email || !password) {
    setError('Please enter both email and password')
    return
  }

  try {
    const res = await api.post('/auth/login', { email, password })
    console.log('Login success:', res.data)

    const token = res.data.access_token
    localStorage.setItem('token', token)
    router.push('/dashboard')
  } catch (err: any) {
    console.error('Login error:', err?.response?.data || err.message)
    setError('Invalid credentials') // generic error
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-[10px_10px_30px_#0a0a0a,_-10px_-10px_30px_#1a1a1a] bg-[#1c1c1c] border border-[#2c2c2c]">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Login</h2>

          {error && (
            <div className="bg-red-500/20 text-red-400 text-sm rounded-md px-4 py-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-[#1c1c1c] border border-[#333] text-white placeholder:text-gray-400 shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#1c1c1c] border border-[#333] text-white placeholder:text-gray-400 shadow-inner"
            />
          </div>

          <Button onClick={handleLogin} className="w-full mt-4 bg-white text-black hover:bg-gray-100">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
