-- 1. Crear tabla de flores (catálogo)
CREATE TABLE IF NOT EXISTS public.flores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT NOT NULL, -- Ej: 'Rosa', 'Tulipán', 'Girasol'
    imagen_url TEXT NOT NULL,
    precio DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Crear tabla de likes
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    flor_id UUID REFERENCES public.flores(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, flor_id) -- Un usuario solo puede dar un like a una misma flor
);

-- 3. Habilitar RLS (Row Level Security) para seguridad
ALTER TABLE public.flores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para la tabla flores (Todos pueden ver el catálogo)
CREATE POLICY "Flores son visibles para todos" ON public.flores
    FOR SELECT USING (true);

-- 5. Políticas para la tabla likes (Los usuarios solo ven y modifican sus propios likes)
CREATE POLICY "Usuarios ven sus propios likes" ON public.likes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus likes" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus likes" ON public.likes
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Modificar tabla de preferencias (opcional, para vincular el pedido al usuario)
ALTER TABLE public.preferencias ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 7. Insertar datos de prueba para el catálogo
INSERT INTO public.flores (nombre, descripcion, tipo, imagen_url) VALUES
('Ramo de Rosas Rojas', 'Clásico ramo para expresar amor profundo', 'Rosa', 'https://images.unsplash.com/photo-1548094891-c4ba474eb5a0?q=80&w=600&auto=format&fit=crop'),
('Rosas Rosadas', 'Elegantes y sutiles para cualquier ocasión', 'Rosa', 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600&auto=format&fit=crop'),
('Girasoles del Sol', 'Radiantes y llenos de energía', 'Girasol', 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=600&auto=format&fit=crop'),
('Tulipanes de Primavera', 'Frescura y colores vibrantes', 'Tulipán', 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=600&auto=format&fit=crop'),
('Mix Floral', 'Una combinación perfecta de varias flores', 'Mixto', 'https://images.unsplash.com/photo-1563241598-a28d5423f5b4?q=80&w=600&auto=format&fit=crop');
