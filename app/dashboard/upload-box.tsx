'use client'

import { useState } from 'react'
import { InboxIcon } from 'lucide-react'

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.endsWith('.zip')) {
        setError('Please upload a .zip file exported from Instagram.')
        setFile(null)
      } else {
        setError('')
        setFile(selected)
      }
    }
  }

  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition">
      <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
        <InboxIcon className="w-10 h-10 text-blue-500" />
        <span className="text-gray-600">Click to select or drag-and-drop your <b>.zip</b> file</span>
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-4 text-blue-700 font-medium">
          Selected file: {file.name}
        </div>
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  )
}
