'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Flor = {
  id: string
  nombre: string
  descripcion: string
  tipo: string
  imagen_url: string
}

export default function CatalogoFlores({ onSelect }: { onSelect: (nombre: string) => void }) {
  const [flores, setFlores] = useState<Flor[]>([])
  const [likes, setLikes] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Cargar flores
      const { data: floresData } = await supabase.from('flores').select('*')
      if (floresData) setFlores(floresData)

      // Cargar likes del usuario
      const { data: likesData } = await supabase
        .from('likes')
        .select('flor_id')
        .eq('user_id', session.user.id)
      
      if (likesData) {
        setLikes(new Set(likesData.map(l => l.flor_id)))
      }
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const toggleLike = async (florId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const isLiked = likes.has(florId)
    const newLikes = new Set(likes)
    
    if (isLiked) {
      newLikes.delete(florId)
      setLikes(newLikes)
      await supabase.from('likes').delete().eq('flor_id', florId).eq('user_id', session.user.id)
    } else {
      newLikes.add(florId)
      setLikes(newLikes)
      await supabase.from('likes').insert({ flor_id: florId, user_id: session.user.id })
    }
  }

  const floresFiltradas = flores.filter(f => 
    f.nombre.toLowerCase().includes(search.toLowerCase()) || 
    f.tipo.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="text-center py-4 text-pink-400 animate-pulse">Cargando catálogo...</div>

  return (
    <div className="w-full bg-white/50 rounded-xl p-4 border border-pink-100 shadow-sm mt-2">
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Buscar flores (ej: tulipán, rojas...)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-pink-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {floresFiltradas.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-2 text-center py-4">No se encontraron flores.</p>
        ) : (
          floresFiltradas.map(flor => (
            <div 
              key={flor.id} 
              className="relative group cursor-pointer rounded-lg overflow-hidden border border-pink-100 bg-white hover:border-pink-300 transition-colors"
              onClick={() => onSelect(flor.nombre)}
            >
              <img src={flor.imagen_url} alt={flor.nombre} className="w-full h-24 object-cover" />
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 text-xs truncate" title={flor.nombre}>{flor.nombre}</h3>
                <p className="text-[10px] text-gray-500 truncate">{flor.tipo}</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike(flor.id)
                }}
                className="absolute top-1 right-1 p-1.5 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
              >
                <svg 
                  className={`w-4 h-4 transition-colors ${likes.has(flor.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={likes.has(flor.id) ? "0" : "2"}
                  fill={likes.has(flor.id) ? "currentColor" : "none"}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #fbcfe8; border-radius: 20px; }
      `}</style>
    </div>
  )
}
