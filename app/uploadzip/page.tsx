'use client'

import { useState } from 'react'
import { Inbox } from 'lucide-react'

export default function UploadZip() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && selected.name.endsWith('.zip')) {
      setFile(selected)
    } else {
      alert('Please upload a valid .zip file')
    }
  }

  const handleSubmit = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload-zip', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      alert('Uploaded and processing started ✅')
      setFile(null)
      // Optionally reload stats
    } else {
      alert('Failed to upload. Please try again.')
    }
  }

  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
      <label className="cursor-pointer">
        <input type="file" accept=".zip" className="hidden" onChange={handleFileChange} />
        <div className="flex flex-col items-center space-y-2">
          <Inbox className="h-10 w-10 text-indigo-500" />
          <p className="text-gray-600 text-sm">
            Click to select or drag-and-drop your <strong>.zip</strong> file
          </p>
        </div>
      </label>

      {file && (
        <div className="mt-4">
          <p className="text-sm text-indigo-600">{file.name}</p>
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Proceed & Analyze
          </button>
        </div>
      )}
    </div>
  )
}
