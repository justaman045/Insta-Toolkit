// File: app/dashboard/pending-requests/page.tsx

'use client'

import { useState } from 'react'

interface Request {
  username: string
  href: string
  timestamp: string
}

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const raw = JSON.parse(text)
      const parsed: Request[] = raw.relationships_follow_requests_sent.map((entry: any) => {
        const d = entry?.string_list_data?.[0]
        return {
          username: d?.value,
          href: d?.href,
          timestamp: new Date(d?.timestamp * 1000).toLocaleDateString()
        }
      })

      setRequests(parsed)
      setError(null)
    } catch {
      setError('Invalid pending_follow_requests.json')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">📩 Pending Requests</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Upload your <code className="text-blue-600 dark:text-blue-400">pending_follow_requests.json</code> to see accounts you sent follow requests to.
      </p>

      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-6 block w-full max-w-sm text-sm text-gray-700 dark:text-white dark:bg-gray-800 dark:border-gray-700 border rounded-md p-2"
      />

      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      {requests.length > 0 ? (
        <div>
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">📊 Analysis</h2>
            <p className="text-gray-700 dark:text-gray-300">Total Pending Requests: <span className="text-indigo-600 dark:text-indigo-400 font-medium">{requests.length}</span></p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {requests.map((r, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl shadow hover:shadow-md transition">
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  @{r.username}
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400">Requested on {r.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">No pending requests to show yet.</p>
      )}
    </div>
  )
}
