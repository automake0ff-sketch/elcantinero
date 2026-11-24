import fs from 'fs';
import path from 'path';
import { CartaData, Plato, DatosRestaurante } from './types';

const cartaPath = path.join(process.cwd(), 'src', 'data', 'carta.json');
const restaurantePath = path.join(process.cwd(), 'src', 'data', 'restaurante.json');

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
    // Validar integridad mínima
    if (!data.platos || !Array.isArray(data.platos)) {
      throw new Error('Estructura de platos inválida');
    }
    fs.writeFileSync(cartaPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error guardando carta.json:', error);
    throw new Error('No se pudo guardar la información de la carta');
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
    throw new Error('No se pudo guardar los datos del restaurante');
  }
}
