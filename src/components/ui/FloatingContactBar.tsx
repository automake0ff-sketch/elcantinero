'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Utensils } from 'lucide-react';
import restauranteData from '@/data/restaurante.json';

export default function FloatingContactBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0E0D0B]/95 backdrop-blur-lg border-t border-[#E5A93C]/30 px-3 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Botón Llamar */}
        <a
          href={restauranteData.telefonoHref}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C98A26] text-[#0E0D0B] font-bold shadow-md active:scale-95 transition-transform"
          aria-label={`Llamar al bar ${restauranteData.telefono}`}
        >
          <Phone className="w-4 h-4 fill-current mb-0.5" />
          <span className="text-[11px] leading-tight font-extrabold uppercase tracking-tight">Llamar</span>
        </a>

        {/* Botón Carta */}
        <Link
          href="/carta"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#1C1917] text-[#FDFCF7] border border-[#E5A93C]/40 font-semibold active:scale-95 transition-transform"
        >
          <Utensils className="w-4 h-4 text-[#E5A93C] mb-0.5" />
          <span className="text-[11px] leading-tight text-[#E5A93C] font-bold uppercase tracking-tight">Ver Carta</span>
        </Link>

        {/* Botón Cómo llegar */}
        <a
          href={restauranteData.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#1C1917] text-[#FDFCF7] border border-white/10 font-semibold active:scale-95 transition-transform"
          aria-label="Abrir mapa de Google"
        >
          <MapPin className="w-4 h-4 text-[#E5A93C] mb-0.5" />
          <span className="text-[11px] leading-tight font-medium uppercase tracking-tight">Cómo llegar</span>
        </a>
      </div>
    </div>
  );
}
