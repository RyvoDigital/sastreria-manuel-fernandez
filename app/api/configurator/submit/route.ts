import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createConfiguration } from '@/lib/admin/db'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  fabric: z.string().optional(),
  measurements: z.record(z.string(), z.any()).optional(),
  designOptions: z.record(z.string(), z.any()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed' },
        { status: 400 }
      )
    }

    const config = await createConfiguration(parsed.data)

    return NextResponse.json({ success: true, configuration: config })
  } catch (err) {
    console.error('Configurator submit error:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
