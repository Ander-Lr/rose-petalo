'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import CatalogoFlores from '@/components/CatalogoFlores'

export default function Home() {
  const [form, setForm] = useState({
    nombre: '', contacto: '', color_rosa: '', cantidad_rosas: '',
    tipo_chocolate: '', extras: '', fecha_ideal: '', mensaje: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    }
    checkSession()
  }, [router, supabase])

  const cambiar = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async () => {
    setIsSubmitting(true)
    // Pequeña pausa para mostrar la animación del botón
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const res = await fetch('/api/preferencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setIsSubmitting(false)
    if (res.ok) {
      setEnviado(true)
    } else {
      const errorData = await res.json()
      console.error('Error al enviar el formulario:', errorData)
      alert(`Ocurrió un error: ${errorData.error || 'Desconocido'}`)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4">
       <div className="animate-pulse flex items-center gap-2 text-pink-600">Cargando...</div>
    </div>
  )

  if (enviado)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-10 text-center max-w-md w-full transform animate-fade-in-up">
          <div className="text-6xl mb-6">✨🌹✨</div>
          <h2 className="text-3xl font-serif text-pink-700 mb-3 font-bold">¡Gracias por tu pedido!</h2>
          <p className="text-gray-600 text-lg">Tu regalo ideal ha sido registrado exitosamente. Nos pondremos en contacto pronto.</p>
          <button onClick={() => setEnviado(false)} className="mt-6 text-pink-500 underline text-sm">Hacer otro pedido</button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-12 px-4 relative overflow-hidden flex flex-col items-center">
      {/* Elementos decorativos de fondo animados (Blobs) */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {user && (
        <div className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10 px-4">
          <span className="text-sm font-medium text-pink-600/80">
            Logueado como: {user.email}
          </span>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
            className="text-xs bg-white/50 hover:bg-white text-pink-600 px-3 py-1.5 rounded-full transition-colors border border-pink-100 shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      <div className="max-w-lg w-full relative z-10 bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-pink-900/5 rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-pink-500/10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-3 font-bold tracking-tight">
            Rosé & Pétalo
          </h1>
          <p className="text-pink-600/90 font-medium text-lg">Arma tu regalo ideal 💝</p>
        </div>

        <div className="space-y-5">
          <div className="group">
            <input name="nombre" placeholder="Tu nombre" onChange={cambiar}
              className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 focus:bg-white transition-all duration-300 shadow-sm" />
          </div>
          
          <div className="group">
            <input name="contacto" placeholder="Tu contacto (correo o teléfono)" onChange={cambiar}
              className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 focus:bg-white transition-all duration-300 shadow-sm" />
          </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-pink-600/90 mb-2">Selecciona tus flores favoritas del catálogo:</label>
              {form.color_rosa && (
                <div className="bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full inline-block text-xs font-semibold mb-2">
                  Seleccionado: {form.color_rosa}
                </div>
              )}
              <CatalogoFlores onSelect={(nombre) => setForm({ ...form, color_rosa: nombre })} />
            </div>

            <div className="sm:col-span-2">
              <input name="cantidad_rosas" type="number" placeholder="¿Cuántas flores quieres?" onChange={cambiar}
                className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 focus:bg-white transition-all duration-300 shadow-sm" />
            </div>

          <div className="relative">
            <select name="tipo_chocolate" onChange={cambiar}
              className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 focus:bg-white transition-all duration-300 shadow-sm appearance-none cursor-pointer">
              <option value="" className="text-gray-400">Chocolate favorito 🍫</option>
              <option value="Con leche">Con leche</option>
              <option value="Amargo">Amargo</option>
              <option value="Blanco">Blanco</option>
              <option value="Relleno de fresa">Relleno de fresa</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pink-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <input name="extras" placeholder="¿Algo más? (peluche, carta...)" onChange={cambiar}
            className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 focus:bg-white transition-all duration-300 shadow-sm" />

          <textarea name="mensaje" placeholder="Un mensaje o nota especial..." onChange={cambiar} rows={3}
            className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 focus:bg-white transition-all duration-300 shadow-sm resize-none" />

          <button onClick={enviar} disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl py-4 mt-2 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:from-pink-600 hover:to-rose-600 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 group">
            {isSubmitting ? (
              <span className="animate-pulse flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Procesando...
              </span>
            ) : (
              <>
                Enviar mi pedido ideal 
                <span className="group-hover:scale-125 transition-transform duration-300 inline-block">🌹</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}