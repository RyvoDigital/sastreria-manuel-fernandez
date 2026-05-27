'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ContentItem {
  id: string
  value: string
}

interface ContentContextValue {
  content: ContentItem[]
  loading: boolean
  getValue: (id: string) => string
}

const ContentContext = createContext<ContentContextValue>({
  content: [],
  loading: true,
  getValue: () => '',
})

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getValue = (id: string) => content.find((c) => c.id === id)?.value || ''

  return (
    <ContentContext.Provider value={{ content, loading, getValue }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
