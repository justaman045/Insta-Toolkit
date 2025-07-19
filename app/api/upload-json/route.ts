export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const tool = formData.get('tool')

  if (!file || !tool) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  }

  const content = await file.text()
  let json: any

  try {
    json = JSON.parse(content)
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  // Basic tool-based filters
  if (tool === 'followers' && Array.isArray(json)) {
    return Response.json({ data: json })
  }

  return new Response(JSON.stringify({ error: 'Unsupported tool or bad data' }), { status: 400 })
}
