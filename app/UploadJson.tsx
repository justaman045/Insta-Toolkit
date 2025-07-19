'use client'

import { useState } from 'react'

export default function UploadJson({ tool }: { tool: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState('')
  const [data, setData] = useState<any[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected || !selected.name.endsWith('.json')) {
      setResult('Only .json files are supported.')
      return
    }

    const formData = new FormData()
    formData.append('file', selected)
    formData.append('tool', tool)

    const res = await fetch('/api/upload-json', {
      method: 'POST',
      body: formData,
    })

    const json = await res.json()
    if (res.ok) {
      setData(json.data)
      setResult('✅ File processed successfully!')
    } else {
      setResult('❌ Invalid file or format.')
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" accept=".json" onChange={handleFileChange} />
      <p className="text-sm text-gray-700">{result}</p>

      {data.length > 0 && (
        <ul className="bg-white p-4 border rounded max-h-96 overflow-auto space-y-2">
          {data.map((item, idx) => (
            <li key={idx} className="border-b pb-1 text-gray-800">{item.string || item.value || JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
