import { NextRequest, NextResponse } from 'next/server'
import AdmZip from 'adm-zip'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import os from 'os'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file || file.type !== 'application/zip') {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Save zip to tmp folder
  const tmpDir = path.join(os.tmpdir(), 'instagram-uploads')
  await mkdir(tmpDir, { recursive: true })
  const zipPath = path.join(tmpDir, `upload-${Date.now()}.zip`)
  await writeFile(zipPath, buffer)

  // Extract files
  const zip = new AdmZip(zipPath)
  const extracted = zip.getEntries()

  const result: Record<string, string> = {}

  for (const entry of extracted) {
    if (entry.entryName.endsWith('.json')) {
      const jsonContent = entry.getData().toString('utf-8')
      result[entry.entryName] = jsonContent
      // Optional: Persist to DB or session here
    }
  }

  return NextResponse.json({ message: 'ZIP processed', files: Object.keys(result) })
}
