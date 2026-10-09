import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { requireAdmin } from '@/lib/admin/server'
import { FOTO_PREFIXES } from '@/lib/admin/fotos'

// Issues short-lived client tokens so photos go browser → Blob directly,
// avoiding the 4.5 MB function body limit for iPad camera shots.
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await requireAdmin()
        if (!FOTO_PREFIXES.some((p) => pathname.startsWith(p)) || pathname.includes('..')) {
          throw new Error('Invalid path')
        }
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = (error as Error).message
    if (message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Upload token error:', error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
