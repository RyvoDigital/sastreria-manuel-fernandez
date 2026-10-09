'use client'

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { Camera, Loader2, X } from 'lucide-react'

export interface UploadedFoto {
  url: string
  thumbUrl: string
}

// Phone/iPad photos are 4–12 MB; shrink in the browser before they leave the device
async function resize(file: File, maxSide: number, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('encode failed'))), 'image/jpeg', quality)
  )
}

export async function uploadFoto(file: File, folder: string): Promise<UploadedFoto> {
  const [full, thumb] = await Promise.all([resize(file, 1600), resize(file, 400, 0.8)])
  const opts = { access: 'public' as const, handleUploadUrl: '/api/admin/uploads', contentType: 'image/jpeg' }
  const [a, b] = await Promise.all([
    upload(`${folder}/foto.jpg`, full, opts),
    upload(`${folder}/thumb.jpg`, thumb, opts),
  ])
  return { url: a.url, thumbUrl: b.url }
}

export default function PhotoUpload({ value, folder, onChange, labels }: {
  value: string | null
  folder: string
  onChange: (foto: UploadedFoto | null) => void
  labels: { add: string; change: string; remove: string; error: string }
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onChange(await uploadFoto(file, folder))
    } catch (err) {
      console.error('Photo upload failed:', err)
      setError(labels.error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#1E3A5F]/30 border border-[#1E3A5F] shrink-0 flex items-center justify-center">
        {busy ? (
          <Loader2 className="animate-spin text-gray-400" size={22} />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element -- Blob host isn't in next.config remotePatterns (public-site file)
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <Camera className="text-gray-500" size={22} />
        )}
      </div>
      <div className="space-y-2">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 min-h-11 px-4 py-2 bg-[#1E3A5F]/50 text-gray-300 rounded-lg text-sm hover:bg-[#1E3A5F] disabled:opacity-50"
        >
          <Camera size={16} />
          {value ? labels.change : labels.add}
        </button>
        {value && !busy && (
          <button type="button" onClick={() => onChange(null)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400">
            <X size={14} />
            {labels.remove}
          </button>
        )}
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  )
}
