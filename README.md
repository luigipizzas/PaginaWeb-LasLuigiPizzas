# Las Luigi Pizzas — Sitio web

Landing page y panel de administración de Las Luigi Pizzas.
Hecho con Next.js 16 (App Router) y Supabase.

## Qué hace

- **Landing** (`/`): la página pública, con el menú, los reels, las sucursales
  y todas las animaciones de scroll.
- **Panel** (`/admin`): acceso privado del dueño para editar el contenido del
  sitio sin tocar código.

## Cómo entrar al panel

1. Ir a `/admin`.
2. Ingresar con el correo y la contraseña del dueño.
3. Desde *Mi cuenta* se pueden cambiar el correo y la contraseña cuando se quiera.

> Solo entra el correo que figure en la tabla `admins` de la base de datos.
> Cualquier otra cuenta es rechazada.

## Poner en marcha (desarrollo)

```bash
npm install
cp .env.example .env.local   # completar con los datos del proyecto de Supabase
npm run dev
```

Queda andando en http://localhost:3000

### Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Correo inicial del admin (informativo) |
| `NEXT_PUBLIC_SITE_URL` | Dominio del sitio publicado |

Se cargan igual en Vercel, en *Settings → Environment Variables*.

## Cómo está organizado

```
app/                  Rutas (landing, panel, autenticación)
components/landing/   La landing partida en componentes
  Landing.tsx           Markup de la página
  Animaciones.tsx       Scroll suave (Lenis) y animaciones (GSAP)
  MenuGrid.tsx          Grilla del menú, con datos de la base
lib/                  Clientes de Supabase y tipos
public/               Imágenes y videos
legacy/               La landing original en HTML, como referencia
proxy.ts              Refresca la sesión y protege /admin
```

## Base de datos

| Tabla | Contenido |
|---|---|
| `products` | Productos del menú |
| `reels` | Reels de Instagram |
| `sucursales` | Locales, horarios y contacto |
| `content` | Textos e imágenes generales |
| `admins` | Correos con permiso de edición |

Las imágenes se guardan en el bucket `media`.

## Seguridad

El acceso está cerrado en tres capas independientes:

1. **`proxy.ts`** — manda al login a quien no tenga sesión.
2. **Servidor** — cada página del panel revalida el permiso antes de mostrar nada.
3. **Row Level Security (Postgres)** — el candado real. Cualquiera puede *leer*
   el contenido del sitio, pero **escribir** solo lo permite un correo que esté
   en `admins`. Aunque alguien obtenga la clave pública, no puede modificar nada.

El cambio de correo y contraseña exige confirmar la contraseña actual.

## Mantener despierta la base

Supabase pausa los proyectos del plan gratuito que pasan una semana sin
actividad. Para evitarlo hay una tarea programada **dentro de Supabase** que,
tres veces por día, le pega por HTTP a `/api/mantener-viva`. Ese endpoint hace
una consulta mínima a la base (sólo el conteo, sin traer filas).

El rebote es intencional. Lo que Supabase cuenta como actividad son las llamadas
a la API del proyecto: un `pg_cron` que consultara las tablas directamente se
ejecutaría igual, pero **no evitaría la pausa**. Al pasar por el sitio, la
consulta entra por la API y sí queda registrada.

Todo vive en la base (extensiones `pg_cron` y `pg_net`), así que no depende del
plan de Vercel.

### Cambiar el dominio o la frecuencia

```sql
select cron.schedule(
  'mantener-viva',
  '0 */8 * * *',
  $$ select net.http_get(url := 'https://TU-DOMINIO/api/mantener-viva'); $$
);
```

Usar el mismo nombre reemplaza la tarea. Para ver el estado:

```sql
select * from cron.job;                                  -- tareas programadas
select * from cron.job_run_details order by start_time desc limit 10;  -- ejecuciones
```

Si el proyecto pasa a un plan pago, la tarea deja de ser necesaria:
`select cron.unschedule('mantener-viva');`

## Publicar

El sitio se despliega en Vercel conectando este repositorio. Cada push a `main`
actualiza la página automáticamente.
