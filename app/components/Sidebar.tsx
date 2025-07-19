'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import ThemeToggle from '@/app/components/ThemeToggle' // ✅ Import toggle

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Upload ZIP', href: '/uploadzip' },
  { label: 'Followers', href: '/dashboard/followers' },
  { label: 'Following', href: '/dashboard/following' },
  { label: 'Non-Followers', href: '/dashboard/nonfollowers' },
  { label: 'Pending Requests', href: '/dashboard/pending' }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-md border-r min-h-screen px-4 py-6 hidden md:block">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-8">📊 Insta Toolkit</h2>

      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === item.href
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* 🔘 Theme Toggle */}
      <div className="mt-10">
        <ThemeToggle />
      </div>

      {/* 🚪 Logout */}
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="flex items-center mt-6 text-sm text-red-600 hover:underline"
      >
        <LogOut className="h-4 w-4 mr-2" /> Logout
      </button>
    </aside>
  )
}
