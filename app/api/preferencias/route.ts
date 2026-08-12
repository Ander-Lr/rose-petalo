import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const datos = await request.json()

    if (!datos.nombre || !datos.color_rosa) {
        return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const { error } = await supabase.from('preferencias').insert({
        user_id: session?.user?.id || null,
        nombre: datos.nombre,
        contacto: datos.contacto,
        color_rosa: datos.color_rosa,
        cantidad_rosas: datos.cantidad_rosas ? parseInt(datos.cantidad_rosas) : null,
        tipo_chocolate: datos.tipo_chocolate,
        extras: datos.extras,
        fecha_ideal: datos.fecha_ideal ? datos.fecha_ideal : null,
        mensaje: datos.mensaje,
    })

    if (error) {
        console.error('Error de Supabase:', error)
        return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}