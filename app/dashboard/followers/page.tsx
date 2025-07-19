'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

type Follower = {
  username: string
  href: string
  followedAt: string
}

type UploadStats = {
  total: number
  added: number
  removed: number
  percentChange: number
}

export default function FollowersPage() {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<UploadStats | null>(null)
  const { data: session } = useSession()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const userId = session?.user && typeof session.user.id === 'string' ? session.user.id : null
    if (!file || !userId) return

    try {
      const text = await file.text()
      const json = JSON.parse(text)

      const parsed: Follower[] = json.map((entry: any) => {
        const d = entry?.string_list_data?.[0]
        return {
          username: d?.value,
          href: d?.href,
          followedAt: new Date(d?.timestamp * 1000).toLocaleDateString(),
        }
      }).filter((f: Follower) => !!f.username)

      // Fetch previous batch from the API
      const res = await fetch(`/api/followers/diff?userId=${userId}`)
      const { previous } = await res.json()

      const previousUsernames = new Set(previous.map((f: any) => f.username))
      const currentUsernames = new Set(parsed.map(f => f.username))

      const added = [...currentUsernames].filter(x => !previousUsernames.has(x))
      const removed = [...previousUsernames].filter(x => !currentUsernames.has(x))

      const percentChange = previous.length > 0
        ? ((parsed.length - previous.length) / previous.length) * 100
        : 100

      setStats({
        total: parsed.length,
        added: added.length,
        removed: removed.length,
        percentChange: parseFloat(percentChange.toFixed(2))
      })

      setFollowers(parsed)
      setError(null)

      // Upload current data to the server with batch tracking
      await fetch('/api/followers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, followers: parsed }),
      })

    } catch (err) {
      setError('Invalid followers_1.json format.')
      console.error(err)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">👥 Followers</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Upload your <code className="text-blue-600 dark:text-blue-400">followers_1.json</code> file to see the list of your followers.
      </p>

      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-6 block w-full max-w-sm text-sm text-gray-700 dark:text-white dark:bg-gray-800 border dark:border-gray-700 p-2 rounded"
      />

      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      {stats && (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-2">📊 Upload Summary</h3>
          <p>Total Followers: {stats.total}</p>
          <p>New: <span className="text-green-500">+{stats.added}</span> | Removed: <span className="text-red-500">-{stats.removed}</span></p>
          <p className="text-blue-600">Change: {stats.percentChange}%</p>
        </div>
      )}

      {followers.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {followers.map((f, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl shadow hover:shadow-md transition">
              <a href={f.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                @{f.username}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">Followed on {f.followedAt}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">No data yet. Upload your followers file to get started.</p>
      )}
    </div>
  )
}
