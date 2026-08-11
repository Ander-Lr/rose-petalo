'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({
    nombre: '', contacto: '', color_rosa: '', cantidad_rosas: '',
    tipo_chocolate: '', extras: '', fecha_ideal: '', mensaje: '',
  })
  const [enviado, setEnviado] = useState(false)

  const cambiar = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async () => {
    const res = await fetch('/api/preferencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) setEnviado(true)
  }

  if (enviado)
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-2xl text-pink-700">¡Gracias! Tu pedido ideal fue registrado 🌹</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-serif text-pink-700 text-center mb-1">Rosé & Pétalo</h1>
        <p className="text-center text-pink-500 mb-6">Arma tu regalo ideal</p>

        <div className="space-y-4">
          <input name="nombre" placeholder="Tu nombre" onChange={cambiar}
            className="w-full border rounded-lg px-4 py-2" />
          <input name="contacto" placeholder="Tu contacto (correo o teléfono)" onChange={cambiar}
            className="w-full border rounded-lg px-4 py-2" />

          <select name="color_rosa" onChange={cambiar}
            className="w-full border rounded-lg px-4 py-2 text-gray-600">
            <option value="">¿Qué rosas prefieres?</option>
            <option>Rojas</option>
            <option>Rosadas</option>
            <option>Blancas</option>
            <option>Mixtas</option>
          </select>

          <input name="cantidad_rosas" type="number" placeholder="¿Cuántas rosas?" onChange={cambiar}
            className="w-full border rounded-lg px-4 py-2" />

          <select name="tipo_chocolate" onChange={cambiar}
            className="w-full border rounded-lg px-4 py-2 text-gray-600">
            <option value="">Chocolate favorito</option>
            <option>Con leche</option>
            <option>Amargo</option>
            <option>Blanco</option>
            <option>Relleno de fresa</option>
          </select>

          <input name="extras" placeholder="¿Algo más? (peluche, carta...)" onChange={cambiar}
            className="w-full border rounded-lg px-4 py-2" />

          <textarea name="mensaje" placeholder="Un mensaje o nota especial" onChange={cambiar}
            className="w-full border rounded-lg px-4 py-2" />

          <button onClick={enviar}
            className="w-full bg-pink-500 text-white rounded-lg py-3 hover:bg-pink-600">
            Enviar mi pedido ideal 🌹
          </button>
        </div>
      </div>
    </div>
  )
}