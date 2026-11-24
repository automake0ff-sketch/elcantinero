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

export interface RedesSociales {
  instagramUrl: string;
  tiktokUrl: string;
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
  tiktokUrl: string;
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
  estado: 'publicado' | 'borrador';
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

export interface Promocion {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activa' | 'borrador' | 'pausada';
  destacadaPortada: boolean;
  condiciones: string;
  orden: number;
}

export interface MesaQR {
  id: string;
  numeroMesa: number;
  nombre: string;
  activa: boolean;
  totalEscaneos: number;
  fechaCreacion: string;
}

export type TipoEventoMetrica =
  | 'visita_home'
  | 'visita_carta'
  | 'clic_llamar'
  | 'clic_maps'
  | 'clic_instagram'
  | 'clic_tiktok'
  | 'escaneo_qr'
  | 'consulta_plato';

export interface EventoMetrica {
  id?: string;
  tipo: TipoEventoMetrica;
  entidadId?: string;
  metadata?: Record<string, string | number>;
  fecha: string;
}

export interface ResumenEstadisticas {
  totalVisitasHome: number;
  totalVisitasCarta: number;
  totalClicsLlamar: number;
  totalClicsMaps: number;
  totalClicsInstagram: number;
  totalClicsTikTok: number;
  totalEscaneosQR: number;
  platosMasConsultados: { id: string; nombre: string; consultas: number }[];
  escaneosPorMesa: { numeroMesa: number; nombre: string; escaneos: number }[];
  periodoDias: number;
}
