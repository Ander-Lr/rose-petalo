'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })
      if (error) throw error
      
      setStep('code')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      })
      if (error) throw error
      
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Código incorrecto o expirado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-12 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full relative z-10 bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 transition-all">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-2 font-bold">
            Rosé & Pétalo
          </h1>
          <p className="text-pink-600/90 font-medium">
            {step === 'email' ? 'Ingresa tu correo 🌸' : 'Verifica tu correo 💌'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100 mb-5">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <p className="text-sm text-gray-600 text-center">Te enviaremos un código de un solo uso a tu correo para ingresar sin contraseña.</p>
            <div>
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all shadow-sm text-center"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl py-4 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:from-pink-600 hover:to-rose-600 transition-all flex justify-center items-center"
            >
              {loading ? 'Enviando código...' : 'Enviar Código Mágico'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <p className="text-sm text-gray-600 text-center">Ingresa el código de 6 dígitos que enviamos a <strong>{email}</strong></p>
            <div>
              <input 
                type="text" 
                placeholder="000000" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="w-full bg-white/80 border border-pink-100 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all shadow-sm text-center text-2xl tracking-widest font-mono"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl py-4 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:from-pink-600 hover:to-rose-600 transition-all flex justify-center items-center"
            >
              {loading ? 'Verificando...' : 'Entrar al catálogo'}
            </button>
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => setStep('email')}
                className="text-pink-500 hover:text-pink-600 font-medium text-sm transition-colors"
              >
                ← Usar otro correo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
