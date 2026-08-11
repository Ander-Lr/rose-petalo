import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const datos = await request.json()

    if (!datos.nombre || !datos.color_rosa) {
        return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const { error } = await supabase.from('preferencias').insert({
        nombre: datos.nombre,
        contacto: datos.contacto,
        color_rosa: datos.color_rosa,
        cantidad_rosas: datos.cantidad_rosas,
        tipo_chocolate: datos.tipo_chocolate,
        extras: datos.extras,
        fecha_ideal: datos.fecha_ideal,
        mensaje: datos.mensaje,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}