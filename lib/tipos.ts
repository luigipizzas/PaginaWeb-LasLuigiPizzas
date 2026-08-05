export type Producto = {
  id: string;
  name: string;
  tag: string | null;
  price: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
};

export type Reel = {
  id: string;
  title: string | null;
  caption: string | null;
  ig_url: string | null;
  video_url: string | null;
  poster_url: string | null;
  sort_order: number;
  visible: boolean;
};

export type Sucursal = {
  id: string;
  nombre: string;
  direccion: string | null;
  horario: string | null;
  telefono: string | null;
  whatsapp: string | null;
  maps_url: string | null;
  sort_order: number;
  visible: boolean;
};
