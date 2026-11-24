import fs from 'fs';
import path from 'path';
import {
  CartaData,
  Plato,
  DatosRestaurante,
  Promocion,
  MesaQR,
  EventoMetrica,
  ResumenEstadisticas,
} from './types';

const dataDir = path.join(process.cwd(), 'src', 'data');
const cartaPath = path.join(dataDir, 'carta.json');
const restaurantePath = path.join(dataDir, 'restaurante.json');
const promocionesPath = path.join(dataDir, 'promociones.json');
const mesasPath = path.join(dataDir, 'mesas_qr.json');
const metricasPath = path.join(dataDir, 'metricas.json');

// Memoria caché para persistencia durante la ejecución del proceso
const memoriaEventos: EventoMetrica[] = [];

// ==========================================
// PLATOS
// ==========================================

export async function getPlatos(soloPublicados = false): Promise<Plato[]> {
  try {
    const raw = fs.readFileSync(cartaPath, 'utf-8');
    const data: CartaData = JSON.parse(raw);
    if (soloPublicados) {
      return data.platos.filter((p) => p.estado !== 'borrador');
    }
    return data.platos;
  } catch {
    return [];
  }
}

export async function savePlato(plato: Plato): Promise<Plato> {
  const raw = fs.readFileSync(cartaPath, 'utf-8');
  const data: CartaData = JSON.parse(raw);
  const idx = data.platos.findIndex((p) => p.id === plato.id);
  if (idx >= 0) {
    data.platos[idx] = plato;
  } else {
    data.platos.push(plato);
  }
  try {
    fs.writeFileSync(cartaPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Si el entorno es read-only en serverless, se conserva en el objeto
  }
  return plato;
}

export async function deletePlato(id: string): Promise<boolean> {
  try {
    const raw = fs.readFileSync(cartaPath, 'utf-8');
    const data: CartaData = JSON.parse(raw);
    data.platos = data.platos.filter((p) => p.id !== id);
    fs.writeFileSync(cartaPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// PROMOCIONES
// ==========================================

export async function getPromociones(soloActivas = false): Promise<Promocion[]> {
  try {
    const raw = fs.readFileSync(promocionesPath, 'utf-8');
    const promos: Promocion[] = JSON.parse(raw);
    const now = new Date().getTime();
    if (soloActivas) {
      return promos.filter((p) => {
        const start = new Date(p.fechaInicio).getTime();
        const end = new Date(p.fechaFin).getTime();
        return p.estado === 'activa' && now >= start && now <= end;
      });
    }
    return promos;
  } catch {
    return [];
  }
}

export async function savePromocion(promo: Promocion): Promise<Promocion> {
  let promos: Promocion[] = [];
  try {
    promos = JSON.parse(fs.readFileSync(promocionesPath, 'utf-8'));
  } catch {
    promos = [];
  }
  const idx = promos.findIndex((p) => p.id === promo.id);
  if (idx >= 0) {
    promos[idx] = promo;
  } else {
    promos.push(promo);
  }
  try {
    fs.writeFileSync(promocionesPath, JSON.stringify(promos, null, 2), 'utf-8');
  } catch {
    // Ignore read-only environments
  }
  return promo;
}

export async function deletePromocion(id: string): Promise<boolean> {
  try {
    let promos: Promocion[] = JSON.parse(fs.readFileSync(promocionesPath, 'utf-8'));
    promos = promos.filter((p) => p.id !== id);
    fs.writeFileSync(promocionesPath, JSON.stringify(promos, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// CÓDIGOS QR Y MESAS
// ==========================================

export async function getMesasQR(): Promise<MesaQR[]> {
  try {
    const raw = fs.readFileSync(mesasPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveMesaQR(mesa: MesaQR): Promise<MesaQR> {
  let mesas: MesaQR[] = [];
  try {
    mesas = JSON.parse(fs.readFileSync(mesasPath, 'utf-8'));
  } catch {
    mesas = [];
  }
  const idx = mesas.findIndex((m) => m.id === mesa.id);
  if (idx >= 0) {
    mesas[idx] = mesa;
  } else {
    mesas.push(mesa);
  }
  try {
    fs.writeFileSync(mesasPath, JSON.stringify(mesas, null, 2), 'utf-8');
  } catch {
    // Ignore read-only environments
  }
  return mesa;
}

export async function registrarEscaneoMesa(numeroMesa: number): Promise<void> {
  await registrarEventoMetrica({
    tipo: 'escaneo_qr',
    entidadId: numeroMesa.toString(),
    fecha: new Date().toISOString(),
  });

  const mesas = await getMesasQR();
  const mesa = mesas.find((m) => m.numeroMesa === numeroMesa);
  if (mesa) {
    mesa.totalEscaneos += 1;
    await saveMesaQR(mesa);
  }
}

// ==========================================
// MÉTRICAS Y ANALÍTICA RESPETUOSA CON RGPD
// ==========================================

export async function registrarEventoMetrica(evento: EventoMetrica): Promise<void> {
  const ev = {
    tipo: evento.tipo,
    entidadId: evento.entidadId,
    metadata: evento.metadata,
    fecha: evento.fecha || new Date().toISOString(),
  };

  memoriaEventos.push(ev);

  try {
    let container = { eventos: [] as EventoMetrica[] };
    if (fs.existsSync(metricasPath)) {
      container = JSON.parse(fs.readFileSync(metricasPath, 'utf-8'));
    }
    container.eventos.push(ev);
    if (container.eventos.length > 2000) {
      container.eventos = container.eventos.slice(-2000);
    }
    fs.writeFileSync(metricasPath, JSON.stringify(container, null, 2), 'utf-8');
  } catch {
    // Memoria caché conserva el evento
  }
}

export async function getResumenEstadisticas(periodoDias = 30): Promise<ResumenEstadisticas> {
  let eventos: EventoMetrica[] = [];

  try {
    const raw = fs.readFileSync(metricasPath, 'utf-8');
    const container = JSON.parse(raw);
    eventos = container.eventos || [];
  } catch {
    eventos = [];
  }

  // Combinar con eventos en memoria de la sesión
  if (memoriaEventos.length > 0) {
    eventos = [...eventos, ...memoriaEventos];
  }

  const now = Date.now();
  const cutoff = now - periodoDias * 24 * 60 * 60 * 1000;
  const filtrados = eventos.filter((e) => new Date(e.fecha).getTime() >= cutoff);

  const platosCounter = new Map<string, number>();
  const mesasCounter = new Map<number, number>();

  let visitasHome = 0;
  let visitasCarta = 0;
  let clicsLlamar = 0;
  let clicsMaps = 0;
  let clicsInstagram = 0;
  let clicsTikTok = 0;
  let escaneosQR = 0;

  for (const e of filtrados) {
    if (e.tipo === 'visita_home') visitasHome++;
    if (e.tipo === 'visita_carta') visitasCarta++;
    if (e.tipo === 'clic_llamar') clicsLlamar++;
    if (e.tipo === 'clic_maps') clicsMaps++;
    if (e.tipo === 'clic_instagram') clicsInstagram++;
    if (e.tipo === 'clic_tiktok') clicsTikTok++;
    if (e.tipo === 'escaneo_qr') {
      escaneosQR++;
      if (e.entidadId) {
        const num = parseInt(e.entidadId, 10);
        if (!isNaN(num)) mesasCounter.set(num, (mesasCounter.get(num) || 0) + 1);
      }
    }
    if (e.tipo === 'consulta_plato' && e.entidadId) {
      platosCounter.set(e.entidadId, (platosCounter.get(e.entidadId) || 0) + 1);
    }
  }

  const platos = await getPlatos();
  const platosMasConsultados = Array.from(platosCounter.entries())
    .map(([id, consultas]) => {
      const plato = platos.find((p) => p.id === id);
      return { id, nombre: plato ? plato.nombre : id, consultas };
    })
    .sort((a, b) => b.consultas - a.consultas)
    .slice(0, 5);

  const mesas = await getMesasQR();
  const escaneosPorMesa = mesas.map((m) => ({
    numeroMesa: m.numeroMesa,
    nombre: m.nombre,
    escaneos: mesasCounter.get(m.numeroMesa) || m.totalEscaneos || 0,
  }));

  return {
    totalVisitasHome: visitasHome,
    totalVisitasCarta: visitasCarta,
    totalClicsLlamar: clicsLlamar,
    totalClicsMaps: clicsMaps,
    totalClicsInstagram: clicsInstagram,
    totalClicsTikTok: clicsTikTok,
    totalEscaneosQR: escaneosQR,
    platosMasConsultados,
    escaneosPorMesa,
    periodoDias,
  };
}

// ==========================================
// CARTA DATA Y RESTAURANTE DATA
// ==========================================

export function getCartaData(): CartaData {
  try {
    const raw = fs.readFileSync(cartaPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error leyendo carta.json:', error);
    throw new Error('No se pudo cargar los datos de la carta');
  }
}

export function saveCartaData(data: CartaData): void {
  try {
    if (!data.platos || !Array.isArray(data.platos)) {
      throw new Error('Estructura de platos inválida');
    }
    fs.writeFileSync(cartaPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error guardando carta.json:', error);
  }
}

export function getRestauranteData(): DatosRestaurante {
  try {
    const raw = fs.readFileSync(restaurantePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error leyendo restaurante.json:', error);
    throw new Error('No se pudo cargar la información del restaurante');
  }
}

export function saveRestauranteData(data: DatosRestaurante): void {
  try {
    fs.writeFileSync(restaurantePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error guardando restaurante.json:', error);
  }
}
