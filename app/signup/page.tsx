'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import bcrypt from 'bcryptjs'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">Register</button>
        </form>
      </div>
      <p>Already have a Account? <a className='text-blue-300' href="/login">Login Here!!</a></p>
    </div>
  )
}
