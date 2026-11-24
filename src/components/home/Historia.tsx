'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Users, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import restauranteData from '@/data/restaurante.json';

export default function Historia() {
  const { historia } = restauranteData;

  return (
    <section id="historia" className="py-20 bg-[#0E0D0B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Imagen / Composición */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/assets/imagenes/galeria/barra.svg"
                alt="Barra tradicional de tapas en El Cantinero Tapas Sevilla"
                fill
                className="object-cover"
              />
            </div>
            {/* Tarjeta flotante con valores */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#181613] border border-[#E5A93C]/30 rounded-2xl p-4 shadow-xl max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 flex items-center justify-center text-[#E5A93C]">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FDFCF7]">Hospitalidad Sevillana</p>
                  <p className="text-[11px] text-[#A8A29E]">Trato familiar y raciones con cariño</p>
                </div>
              </div>
            </div>
          </div>

          {/* Texto de historia */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-xs font-semibold text-[#FCD34D] uppercase tracking-wider">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#E5A93C]" />
              Nuestra Casa
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFCF7] leading-tight">
              {historia.titulo}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#A8A29E] leading-relaxed">
              <p>{historia.parrafo1}</p>
              <p>{historia.parrafo2}</p>
              <p>{historia.parrafo3}</p>
            </div>

            {/* Tres pilares */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#14120F] border border-white/5">
                <Users className="w-5 h-5 text-[#E5A93C] shrink-0" />
                <span className="text-xs font-semibold text-[#FDFCF7]">Atención Cercana</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#14120F] border border-white/5">
                <UtensilsCrossed className="w-5 h-5 text-[#E5A93C] shrink-0" />
                <span className="text-xs font-semibold text-[#FDFCF7]">Cocina Tradicional</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#14120F] border border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#E5A93C] shrink-0" />
                <span className="text-xs font-semibold text-[#FDFCF7]">Calidad & Precio Justo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
