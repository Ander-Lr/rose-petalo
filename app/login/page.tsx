'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('Registro exitoso. Revisa tu correo (si tienes confirmación activada) o simplemente inicia sesión.')
        setIsLogin(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-12 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full relative z-10 bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 transition-all">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-2 font-bold">
            Rosé & Pétalo
          </h1>
          <p className="text-pink-600/90 font-medium">{isLogin ? 'Bienvenido de vuelta 💖' : 'Crea tu cuenta 🌸'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all shadow-sm"
            />
          </div>
          
          <div>
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all shadow-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl py-4 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:from-pink-600 hover:to-rose-600 transition-all flex justify-center items-center"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 hover:text-pink-600 font-medium text-sm transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}
