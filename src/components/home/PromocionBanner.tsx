'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Promocion } from '@/lib/types';

export default function PromocionBanner() {
  const [promo, setPromo] = useState<Promocion | null>(null);

  useEffect(() => {
    fetch('/api/admin/promociones?activas=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.promociones && data.promociones.length > 0) {
          const destacada = data.promociones.find((p: Promocion) => p.destacadaPortada) || data.promociones[0];
          setPromo(destacada);
        }
      })
      .catch(() => {});
  }, []);

  // Si no hay ninguna promoción activa vigente, no renderizar nada
  if (!promo) return null;

  return (
    <section className="bg-gradient-to-r from-[#241E18] via-[#1A1713] to-[#12100E] border-y border-[#E5A93C]/30 py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#E5A93C]/40 shrink-0 bg-[#0E0D0B]">
            <Image src={promo.imagen} alt={promo.titulo} fill className="object-cover" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 text-[10px] font-bold text-[#FCD34D] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#E5A93C]" />
              Promoción Destacada
            </div>
            <h3 className="font-serif text-lg font-bold text-[#FDFCF7] leading-tight">
              {promo.titulo}
            </h3>
            <p className="text-xs text-[#A8A29E] max-w-xl">
              {promo.descripcion}
            </p>
            {promo.condiciones && (
              <p className="text-[11px] text-[#FCD34D] pt-0.5">
                ★ {promo.condiciones}
              </p>
            )}
          </div>
        </div>

        <Link
          href="/carta"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#FCD34D] text-[#0E0D0B] font-bold text-xs shadow-md transition-all whitespace-nowrap shrink-0"
        >
          <span>Descubrir en la Carta</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

