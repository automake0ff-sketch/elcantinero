export interface Horario {
  dias: string;
  horas: string;
  tipo: string;
}

export interface Historia {
  titulo: string;
  parrafo1: string;
  parrafo2: string;
  parrafo3: string;
}

export interface Servicios {
  reservasActivas: boolean;
  pedidosWhatsappActivos: boolean;
  terrazaExterior: boolean;
  desayunos: boolean;
  accesible: boolean;
  wifiClientes: boolean;
}

export interface DatosRestaurante {
  nombre: string;
  lema: string;
  subtitulo: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  telefono: string;
  telefonoHref: string;
  whatsapp: string;
  whatsappHref: string;
  instagramUrl: string;
  googleMapsUrl: string;
  googleShareUrl: string;
  valoracionGoogle: number;
  totalResenasGoogle: number;
  horarios: Horario[];
  historia: Historia;
  servicios: Servicios;
  avisoDatos: string;
}

export interface CategoriaPlato {
  id: string;
  nombre: string;
  icono: string;
}

export interface AlergenoItem {
  codigo: string;
  nombre: string;
  icono: string;
}

export interface Plato {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precioTapa: number | null;
  precioRacion: number | null;
  destacado: boolean;
  disponible: boolean;
  imagen: string;
  alergenos: string[];
  etiquetas: string[];
  modelo3d?: {
    glb: string;
    usdz?: string;
  } | null;
}

export interface CartaData {
  categorias: CategoriaPlato[];
  alergenosCatalogo: AlergenoItem[];
  platos: Plato[];
}
