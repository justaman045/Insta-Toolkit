// File: app/dashboard/non-followers/page.tsx

'use client'

import { useState } from 'react'

interface Account {
  username: string
  href: string
}

export default function NonFollowersPage() {
  const [followersSet, setFollowersSet] = useState<Set<string>>(new Set())
  const [followingList, setFollowingList] = useState<Account[]>([])
  const [nonFollowers, setNonFollowers] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFollowersFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const raw = JSON.parse(text)
      const set = new Set<string>(
        raw.map((entry: any) => entry?.string_list_data?.[0]?.value).filter(Boolean)
      )
      setFollowersSet(set)

      if (followingList.length > 0) {
        computeNonFollowers(set, followingList)
      }

      setError(null)
    } catch {
      setError('Invalid followers_1.json file.')
    }
  }

  const handleFollowingFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const raw = JSON.parse(text)
      const data = raw.relationships_following

      const parsed: Account[] = data.map((entry: any) => {
        const info = entry?.string_list_data?.[0]
        return {
          username: info?.value,
          href: info?.href,
        }
      }).filter((a: Account) => !!a.username)

      setFollowingList(parsed)

      if (followersSet.size > 0) {
        computeNonFollowers(followersSet, parsed)
      }

      setError(null)
    } catch {
      setError('Invalid following.json file.')
    }
  }

  const computeNonFollowers = (followers: Set<string>, following: Account[]) => {
    const result = following.filter(f => !followers.has(f.username))
    setNonFollowers(result)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🚫 Non-Followers</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Upload both <code className="text-blue-600 dark:text-blue-400">followers_1.json</code> and <code className="text-blue-600 dark:text-blue-400">following.json</code> to find out who doesn’t follow you back.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <input type="file" accept=".json" onChange={handleFollowersFile} className="text-sm p-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        <input type="file" accept=".json" onChange={handleFollowingFile} className="text-sm p-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>

      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      {nonFollowers.length > 0 ? (
        <div>
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">📊 Analysis</h2>
            <p className="text-gray-700 dark:text-gray-300">Total Following: {followingList.length}</p>
            <p className="text-gray-700 dark:text-gray-300">Non-Followers: <span className="text-red-500 font-medium">{nonFollowers.length}</span></p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nonFollowers.map((u, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl shadow hover:shadow-md transition">
                <a href={u.href} target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                  @{u.username}
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400">Not following you back</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">Upload files to view non-followers.</p>
      )}
    </div>
  )
}
