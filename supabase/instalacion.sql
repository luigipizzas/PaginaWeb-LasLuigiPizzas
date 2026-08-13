-- ============================================================================
--  LAS LUIGI PIZZAS — instalación completa de la base de datos
-- ============================================================================
--  Dejá esto pegado en el SQL Editor de Supabase y ejecutalo de una sola vez.
--  Se puede volver a correr sin romper nada (es idempotente).
--
--  Después de correrlo queda:
--    · Las tablas del contenido del sitio, con los datos actuales cargados
--    · La seguridad: cualquiera puede leer, sólo el admin puede escribir
--    · El bucket de imágenes y videos
--    · El usuario del panel
--    · La tarea que evita que Supabase pause el proyecto
--
--  Antes de ejecutar, revisá el bloque CONFIGURACIÓN de acá abajo.
-- ============================================================================


-- ############################################################################
--  CONFIGURACIÓN — cambiá estos tres valores si hace falta
-- ############################################################################
do $$
begin
  perform set_config('luigi.email',  'luigipizzas.codea@gmail.com', false);
  perform set_config('luigi.clave',  'codea1234',                   false);
  perform set_config('luigi.sitio',  'https://lasluigipizzas.vercel.app', false);
end $$;


-- ############################################################################
--  1. EXTENSIONES
-- ############################################################################
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_cron  with schema pg_catalog;
create extension if not exists pg_net   with schema extensions;


-- ############################################################################
--  2. TABLAS
-- ############################################################################

-- Quién puede editar el sitio. Es la fuente de verdad de los permisos:
-- a propósito no se usa una variable de entorno, así el dueño puede cambiar
-- su correo desde el panel sin quedarse afuera.
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Textos sueltos del sitio (sección Nosotros, franja de pedido, contacto…)
create table if not exists public.content (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  tag         text,
  price       text,
  description text,
  image_url   text,
  sort_order  int  not null default 0,
  visible     boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.reels (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  caption     text,
  ig_url      text,
  video_url   text,
  poster_url  text,
  sort_order  int not null default 0,
  visible     boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.sucursales (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  tag        text,
  direccion  text,
  horario    text,
  telefono   text,
  whatsapp   text,
  maps_url   text,
  mapa_query text,
  sort_order int not null default 0,
  visible    boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Por si la base ya existía de una versión anterior
alter table public.sucursales add column if not exists tag        text;
alter table public.sucursales add column if not exists mapa_query text;

comment on column public.sucursales.tag        is 'Etiqueta chica de la tarjeta, ej: Local 1';
comment on column public.sucursales.mapa_query is 'Dirección que se usa para el mapa embebido';


-- ############################################################################
--  3. FUNCIONES
-- ############################################################################

-- Mantiene updated_at al día.
-- search_path fijo: si no, un esquema malicioso en el path podría desviar
-- a qué función termina llamando.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['content','products','reels','sucursales'] loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger trg_touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ¿El usuario de esta sesión puede editar el sitio?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Postgres concede EXECUTE a PUBLIC por defecto: hay que quitarlo primero.
revoke execute on function public.is_admin() from public, anon, authenticated;
grant  execute on function public.is_admin() to authenticated;

-- Si el admin cambia su correo, la lista blanca lo sigue.
-- Sin esto, cambiar el correo desde el panel te dejaría afuera.
create or replace function public.sync_admin_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.admins
       set email = new.email
     where lower(email) = lower(old.email);
  end if;
  return new;
end $$;

-- Es una función de trigger: nadie debería poder llamarla desde la API.
revoke execute on function public.sync_admin_email() from public, anon, authenticated;

drop trigger if exists trg_sync_admin_email on auth.users;
create trigger trg_sync_admin_email
  after update of email on auth.users
  for each row execute function public.sync_admin_email();

-- Cambiar el correo del panel sin depender del envío de mails.
-- Es SECURITY DEFINER porque toca auth.users, pero valida el permiso adentro.
create or replace function public.cambiar_email_admin(nuevo_email text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_email text := lower(trim(nuevo_email));
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'El correo no tiene un formato válido';
  end if;

  if exists (select 1 from auth.users where lower(email) = v_email and id <> auth.uid()) then
    raise exception 'Ese correo ya está en uso';
  end if;

  update auth.users
     set email = v_email,
         email_confirmed_at = now(),
         updated_at = now()
   where id = auth.uid();

  update auth.identities
     set identity_data = identity_data || jsonb_build_object('email', v_email),
         email = v_email,
         updated_at = now()
   where user_id = auth.uid() and provider = 'email';
end $$;

revoke all   on function public.cambiar_email_admin(text) from public, anon;
grant execute on function public.cambiar_email_admin(text) to authenticated;


-- ############################################################################
--  4. SEGURIDAD (RLS)
--     Cualquiera puede LEER el contenido del sitio.
--     Sólo un correo de public.admins puede ESCRIBIR.
-- ############################################################################
alter table public.admins     enable row level security;
alter table public.content    enable row level security;
alter table public.products   enable row level security;
alter table public.reels      enable row level security;
alter table public.sucursales enable row level security;

do $$
declare t text;
begin
  foreach t in array array['content','products','reels','sucursales'] loop
    execute format('drop policy if exists "lectura publica" on public.%I', t);
    execute format(
      'create policy "lectura publica" on public.%I
       for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "escritura solo admin" on public.%I', t);
    execute format(
      'create policy "escritura solo admin" on public.%I
       for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- La lista de administradores no es pública.
drop policy if exists "admins solo admin" on public.admins;
create policy "admins solo admin" on public.admins
  for all to authenticated using (public.is_admin()) with check (public.is_admin());


-- ############################################################################
--  5. ALMACENAMIENTO (fotos y videos)
-- ############################################################################
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)          -- 50 MB
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "media lectura publica" on storage.objects;
create policy "media lectura publica" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media escritura solo admin" on storage.objects;
create policy "media escritura solo admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());


-- ############################################################################
--  6. USUARIO DEL PANEL
--     Crea el usuario con el correo y la clave del bloque CONFIGURACIÓN.
--     Si ya existe, sólo le actualiza la contraseña.
-- ############################################################################
do $$
declare
  v_email text := current_setting('luigi.email');
  v_pass  text := current_setting('luigi.clave');
  v_id    uuid := gen_random_uuid();
begin
  if exists (select 1 from auth.users where lower(email) = lower(v_email)) then
    update auth.users
       set encrypted_password = extensions.crypt(v_pass, extensions.gen_salt('bf')),
           email_confirmed_at = coalesce(email_confirmed_at, now()),
           updated_at = now()
     where lower(email) = lower(v_email);
  else
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous,
      -- GoTrue espera cadenas vacías acá, no NULL: si van en NULL el login
      -- falla con "Database error querying schema".
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, phone_change, phone_change_token,
      reauthentication_token
    ) values (
      '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated',
      v_email, extensions.crypt(v_pass, extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, false,
      '', '', '', '', '', '', '', ''
    );

    insert into auth.identities (
      provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      v_id::text, v_id,
      jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true),
      'email', now(), now(), now()
    );
  end if;
end $$;

-- Le damos permiso de edición
insert into public.admins (email)
values (current_setting('luigi.email'))
on conflict (email) do nothing;


-- ############################################################################
--  7. CONTENIDO INICIAL
-- ############################################################################

-- Sólo se carga si la tabla está vacía. Es a propósito: estas tablas no tienen
-- una columna única, así que un "on conflict do nothing" no frenaría nada y
-- volver a correr el script duplicaría todo el menú.
do $$
begin
  if not exists (select 1 from public.products) then
    insert into public.products (name, tag, price, description, image_url, sort_order) values
    ('Muzzarella','La clásica','$8.900','Salsa de tomate, doble muzzarella, aceitunas y orégano. La base de todo.','https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop',1),
    ('Fugazzetta','De la casa','$10.500','Cebolla dorada, muzzarella derretida y un toque de queso. Sin salsa, pura cebolla.','https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',2),
    ('Lomo Luigi','El favorito','$11.900','Lomo tierno, muzzarella, jamón, tomate, huevo y todo lo que quieras. No entra en la caja.','https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=800&auto=format&fit=crop',3),
    ('Hamburguesa Completa','Casera','$9.500','Doble medallón casero, cheddar, panceta, lechuga y tomate en pan artesanal.','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',4),
    ('Empanadas','Recién horneadas','$1.400','De carne, jamón y queso, pollo o verdura. Docena o por unidad, como quieras.','https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=800&auto=format&fit=crop',5),
    ('Napolitana','La preferida','$10.900','Rodajas de tomate fresco, ajo, muzzarella y un toque de albahaca. Simple y perfecta.','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',6);
  end if;

  if not exists (select 1 from public.reels) then
    insert into public.reels (title, caption, ig_url, video_url, poster_url, sort_order) values
    ('Lomo Luigi','Juegan en otra liga','https://www.instagram.com/reel/DaTgjNclTYc/','/videos/reel1.mp4','/videos/reel1.jpg',1),
    ('Detrás de la cocina','Los que hacen la magia','https://www.instagram.com/reel/DaEKq1PD6ZY/','/videos/reel2.mp4','/videos/reel2.jpg',2),
    ('¿Sabés quién vino?','Hasta jugadores vienen','https://www.instagram.com/reel/DY98jG-BPgN/','/videos/reel3.mp4','/videos/reel3.jpg',3),
    ('¿Pinta un lomo?','Mañana juega la Selección','https://www.instagram.com/reel/DY45g_QuZB6/','/videos/reel4.mp4','/videos/reel4.jpg',4);
  end if;

  if not exists (select 1 from public.sucursales) then
    insert into public.sucursales (nombre, tag, direccion, horario, telefono, whatsapp, mapa_query, sort_order) values
    ('Sucursal Centro','Local 1','Completá la dirección','Martes a Domingo · 20:00 a 00:30','2616977056','5492616977056','Plaza Independencia, Mendoza, Argentina',1),
    ('Sucursal Norte','Local 2','Completá la dirección','Martes a Domingo · 20:00 a 00:30','Completá el teléfono',null,'Parque General San Martin, Mendoza, Argentina',2);
  end if;
end $$;

insert into public.content (key, value) values
('nosotros', jsonb_build_object(
  'kicker','La parte que más nos gusta',
  'titulo','LUIGI',
  'parrafo1','Somos un local de barrio, de esos donde te conocen por el nombre y saben cómo te gusta la pizza antes de que la pidas.',
  'parrafo2','Amasamos a mano, horneamos a la piedra y armamos cada lomo, hamburguesa y empanada como si fuera para nosotros. Nada de vueltas: ingredientes de verdad y porciones que se sienten.',
  'parrafo3','Y si hay partido de la Selección, ya sabés: la cocina se prende a full. Pasá, pedí, y quedate con la parte que más nos gusta.')),
('cta', jsonb_build_object(
  'titulo','PEDÍ AHORA',
  'texto','Abierto de Martes a Domingo · Envíos a domicilio · Retiro en el local',
  'boton','Hacé tu pedido por WhatsApp')),
('contacto', jsonb_build_object(
  'whatsapp','5492616977056',
  'instagram','lasluigipizzas'))
on conflict (key) do nothing;


-- ############################################################################
--  8. TAREA QUE EVITA LA PAUSA POR INACTIVIDAD
--     La base le pega al sitio y el sitio consulta la base. El rebote es
--     necesario: Supabase cuenta las llamadas a su API, así que una consulta
--     hecha desde adentro de Postgres no evitaría la pausa.
-- ############################################################################
do $$
begin
  perform cron.unschedule('mantener-viva');
exception when others then
  null;  -- no existía todavía
end $$;

select cron.schedule(
  'mantener-viva',
  '0 */8 * * *',            -- tres veces por día (00, 08 y 16 UTC)
  format(
    $cmd$select net.http_get(url := '%s/api/mantener-viva', timeout_milliseconds := 20000);$cmd$,
    current_setting('luigi.sitio')
  )
);


-- ############################################################################
--  9. COMPROBACIÓN
-- ############################################################################
select
  (select count(*) from public.products)   as productos,
  (select count(*) from public.reels)      as reels,
  (select count(*) from public.sucursales) as sucursales,
  (select count(*) from public.content)    as textos,
  (select count(*) from public.admins)     as admins,
  (select count(*) from auth.users)        as usuarios,
  (select count(*) from storage.buckets where id='media') as bucket,
  (select count(*) from cron.job where jobname='mantener-viva') as tarea;
