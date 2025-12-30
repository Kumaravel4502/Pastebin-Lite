// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// function Home() {
//   const [content, setContent] = useState('')
//   const [ttlMinutes, setTtlMinutes] = useState(60)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
    
//     if (!content.trim()) {
//       setError('Please enter some content')
//       return
//     }

//     setLoading(true)

//     try {
//       const res = await fetch('/api/pastes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ content, ttlMinutes })
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.error || 'Failed to create paste')
//       }

//       navigate(`/p/${data.slug}`)
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Create New Paste</h1>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-muted-foreground mb-2">
//             Content
//           </label>
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Paste your code or text here..."
//             className="w-full h-64 px-4 py-3 bg-card border border-border rounded-lg 
//                        text-foreground placeholder-muted-foreground
//                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
//                        font-mono text-sm resize-none"
//           />
//           <p className="text-xs text-muted-foreground mt-1">
//             {content.length} / 50,000 characters
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-muted-foreground mb-2">
//             Expires in
//           </label>
//           <select
//             value={ttlMinutes}
//             onChange={(e) => setTtlMinutes(Number(e.target.value))}
//             className="px-4 py-2 bg-card border border-border rounded-lg 
//                        text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//           >
//             <option value={10}>10 minutes</option>
//             <option value={30}>30 minutes</option>
//             <option value={60}>1 hour</option>
//             <option value={360}>6 hours</option>
//             <option value={1440}>24 hours</option>
//           </select>
//         </div>

//         {error && (
//           <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
//             {error}
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg
//                      hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Creating...' : 'Create Paste'}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default Home