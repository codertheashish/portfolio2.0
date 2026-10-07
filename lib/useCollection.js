'use client'
// Loads a content collection from the Google Sheet (via /api/sheets), falling back to built-in defaults.
import { useState, useEffect } from 'react'
export function useCollection(name, defaults) {
  const [items, setItems] = useState(defaults)
  useEffect(() => {
    let live = true
    fetch('/api/sheets?action=get' + name).then(r => r.json())
      .then(j => { if (live && j.status === 'ok' && j.data?.length) setItems(j.data) })
      .catch(() => {})
    return () => { live = false }
  }, [name])
  return items
}
export const splitList = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean)
