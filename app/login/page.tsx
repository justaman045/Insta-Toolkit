'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const res = await signIn('credentials', {
            ...form,
            redirect: false,
        })

        if (res?.ok) {
            router.push('/dashboard')
        } else {
            setError('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="flex items-center justify-center px-4">
                <form onSubmit={handleSubmit} className=" p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
                    <h2 className="text-2xl font-bold ">Login</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">Login</button>
                </form>
            </div>
            <p>Don't have a account yet? <a className='text-blue-300' href="/signup">Sign-Up Here!!</a></p>
        </div>
    )
}
