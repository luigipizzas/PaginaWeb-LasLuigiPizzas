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
actividad. Para evitarlo, Vercel llama todos los días a `/api/mantener-viva`
(configurado en `vercel.json`), que hace una consulta mínima a la base.

La consulta sale desde la aplicación y no desde un `pg_cron` dentro de Postgres
a propósito: lo que Supabase cuenta como actividad son las llamadas a la API del
proyecto, y un trabajo interno de la base no las genera.

Si el proyecto pasa a un plan pago, el cron deja de ser necesario y se puede
borrar la entrada de `vercel.json`.

## Publicar

El sitio se despliega en Vercel conectando este repositorio. Cada push a `main`
actualiza la página automáticamente.
