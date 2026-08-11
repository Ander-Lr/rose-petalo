create table preferencias (
  id uuid primary key default gen_random_uuid(),
  nombre text,
  contacto text,
  color_rosa text,
  cantidad_rosas int,
  tipo_chocolate text,
  extras text,
  fecha_ideal date,
  mensaje text,
  creado_en timestamp default now()
);

-- Seguridad: activar RLS y permitir solo insertar desde la web
alter table preferencias enable row level security;

create policy "permitir insertar desde la web"
  on preferencias
  for insert
  to anon
  with check (true);