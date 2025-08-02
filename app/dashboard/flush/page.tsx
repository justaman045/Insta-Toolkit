'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

const tableOptions = [
  { key: 'followers', label: 'Followers' },
  { key: 'following', label: 'Following' },
  { key: 'nonFollowers', label: 'Non-Followers' },
  { key: 'pendingRequests', label: 'Pending Requests' },
]

export default function ClearDBPage() {
  const { data: session } = useSession()
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const handleToggle = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const handleClear = async () => {
    if (!session?.user?.id || selected.length === 0) return

    try {
      const res = await fetch('/api/clear-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, tables: selected }),
      })

      if (!res.ok) throw new Error('Failed to clear')

      setStatus('Selected data cleared successfully.')
    } catch (err) {
      console.error(err)
      setStatus('Failed to clear data.')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🧹 Clear Data</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Select the data you want to remove from your account:
      </p>

      <div className="space-y-3 mb-6">
        {tableOptions.map(opt => (
          <label key={opt.key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(opt.key)}
              onChange={() => handleToggle(opt.key)}
              className="accent-blue-600"
            />
            <span className="text-gray-800 dark:text-white">{opt.label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleClear}
        disabled={selected.length === 0}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        Clear Selected Data
      </button>

      {status && (
        <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">{status}</p>
      )}
    </div>
  )
}
