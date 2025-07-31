'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Mail, Lock, UserPlus } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <Card className="w-full max-w-md p-6 rounded-xl shadow-md bg-white border border-green-100">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-green-700">Login</h2>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-lg px-4 py-2 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-green-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-green-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 bg-white border border-green-200 text-green-900 placeholder:text-green-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-green-700">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-green-500" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-white border border-green-200 text-green-900 placeholder:text-green-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <Button onClick={handleLogin} className="w-full mt-4 bg-green-600 text-white hover:bg-green-700 rounded-lg">
            Login
          </Button>
          
          <div className="text-center pt-2">
            <Button 
              variant="ghost" 
              className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
              onClick={() => router.push('/register')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Don't have an account?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
