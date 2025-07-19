// File: app/dashboard/following/page.tsx

'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export type FollowingItem = {
  username: string
  href: string
  followedAt: string
}

export default function FollowingPage() {
  const { data: session } = useSession()
  const [following, setFollowing] = useState<FollowingItem[]>([])
  const [previous, setPrevious] = useState<FollowingItem[]>([])
  const [error, setError] = useState('')
  const [percentChange, setPercentChange] = useState<number | null>(null)

  function parseFollowingJson(json: any): FollowingItem[] {
    if (!Array.isArray(json.relationships_following)) throw new Error('Invalid following.json')

    return json.relationships_following.map((entry: any) => {
      const item = entry.string_list_data?.[0]
      return {
        username: item?.value || '',
        href: item?.href || '',
        followedAt: item?.timestamp ? new Date(item.timestamp * 1000).toLocaleDateString() : '',
      }
    })
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session?.user?.id) return

    try {
      const text = await file.text()
      const json = JSON.parse(text)
      const parsed = parseFollowingJson(json)
      setFollowing(parsed)

      const uploadRes = await fetch('/api/following', {
        method: 'POST',
        body: JSON.stringify({
          userId: session.user.id,
          following: parsed,
        }),
      })

      if (!uploadRes.ok) throw new Error('Failed to upload')

      const diff = await fetch(`/api/following/diff?userId=${session.user.id}`)
      const { previous } = await diff.json()
      setPrevious(previous)

      if (previous.length) {
        const change = ((parsed.length - previous.length) / previous.length) * 100
        setPercentChange(change)
      } else {
        setPercentChange(null)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Invalid file')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">📥 Following Tool</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Upload your <code className="text-blue-600 dark:text-blue-400">following.json</code> file to analyze following activity.
      </p>

      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="mb-6 block w-full max-w-sm text-sm text-gray-700 dark:text-white dark:bg-gray-800 border dark:border-gray-700 p-2 rounded"
      />

      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      {following.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">📊 Analytics</h2>
          <p>Total Following: <span className="font-medium">{following.length}</span></p>
          <p>Previous Batch: <span className="font-medium">{previous.length}</span></p>
          {percentChange !== null && (
            <p>
              Change: <span className={percentChange > 0 ? 'text-green-500' : percentChange < 0 ? 'text-red-500' : ''}>
                {percentChange.toFixed(2)}%
              </span>
            </p>
          )}
        </div>
      )}

      {following.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {following.map((f, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl shadow hover:shadow-md transition">
              <a href={f.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                @{f.username}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">Followed on {f.followedAt}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">No data yet. Upload your following file to get started.</p>
      )}
    </div>
  )
}
