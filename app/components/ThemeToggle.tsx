'use client'

import { useTheme } from '@/app/context/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">Theme</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={isDark}
          onChange={toggleTheme}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-colors duration-300" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300" />
      </div>
    </label>
  )
}
