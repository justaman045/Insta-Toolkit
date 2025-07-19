import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getUserStats } from '@/lib/getStats' // <-- new import
import LogoutButton from './logout-button'
import UploadBox from './upload-box'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const stats = await getUserStats(session.user.id)

  return (
    <main className="min-h-screen bg-gradient-to-br py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">Welcome,</h1>
            <p className="text-2xl text-blue-700">{session.user.name || session.user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <hr />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Upload Instagram Data Export</h2>
          <UploadBox />
        </section>

        <hr />

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title="Followers" value={stats.followers.toString()} />
            <StatCard title="Following" value={stats.following.toString()} />
            <StatCard title="Unfollowers" value={stats.nonFollowers.toString()} />
            <StatCard title="Pending Requests" value={stats.pending.toString()} />
          </div>
        </section>
      </div>
    </main>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition">
      <p className="text-gray-600">{title}</p>
      <h3 className="text-3xl font-bold text-blue-700 mt-2">{value}</h3>
    </div>
  )
}
