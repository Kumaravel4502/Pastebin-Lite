import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function ViewPaste() {
  const { slug } = useParams()
  const [paste, setPaste] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const res = await fetch(`/api/pastes/${slug}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Paste not found')
        }

        setPaste(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPaste()
  }, [slug])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(paste.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Paste Not Found</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Create New Paste
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Views: {paste.viewCount}</span>
          <span>Created: {formatDate(paste.createdAt)}</span>
          <span>Expires: {formatDate(paste.expiresAt)}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-card border border-border rounded-lg 
                       hover:bg-muted transition-colors text-sm"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg 
                       hover:bg-primary/90 transition-colors text-sm"
          >
            New Paste
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <pre className="p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap break-words">
          {paste.content}
        </pre>
      </div>
    </div>
  )
}

export default ViewPaste