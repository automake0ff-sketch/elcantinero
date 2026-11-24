'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Utensils, MapPin, Phone, Star, Sparkles, ChevronRight, Award } from 'lucide-react';
import restauranteData from '@/data/restaurante.json';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-gradient-to-b from-[#0E0D0B] via-[#14120F] to-[#0E0D0B]">
      {/* Luces y texturas ambientales gastronómicas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#E5A93C]/15 via-[#B45309]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#E5A93C]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Contenido Editorial Izquierdo */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Badge de Google y Reputación */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1C1917] border border-[#E5A93C]/30 text-xs text-[#FDFCF7] shadow-lg">
              <span className="flex text-[#FCD34D]">
                <Star className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="font-bold text-[#FCD34D]">{restauranteData.valoracionGoogle} / 5</span>
              <span className="text-[#A8A29E]">&middot; Más de {restauranteData.totalResenasGoogle} opiniones en Google</span>
              <span className="hidden sm:inline text-xs text-[#E5A93C] font-semibold bg-[#E5A93C]/10 px-2 py-0.5 rounded-full">
                Sevilla Este
              </span>
            </div>

            {/* Titular Principal */}
            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#FDFCF7] leading-[1.08]">
              El auténtico sabor del <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCD34D] via-[#E5A93C] to-[#C98A26]">tapeo sevillano</span>
            </h1>

            {/* Subtítulo con datos reales */}
            <p className="text-base sm:text-xl text-[#A8A29E] max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Desayunos tradicionales con pan de masa madre y tapas caseras con raciones abundantes en la <strong className="text-[#FDFCF7] font-semibold">Calle Periodista Juan Tribuna, 5</strong>. Cocina de verdad, ambiente familiar y producto de primera calidad.
            </p>

            {/* Botones de Acción (Llamadas a la acción claras) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/carta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#E5A93C] via-[#D97706] to-[#B45309] text-[#0E0D0B] font-extrabold text-base tracking-wide shadow-xl hover:shadow-[#E5A93C]/25 hover:scale-105 active:scale-95 transition-all"
              >
                <Utensils className="w-5 h-5 fill-current" />
                <span>Descubrir Nuestra Carta</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>

              <a
                href={restauranteData.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#1C1917] hover:bg-[#25221E] text-[#FDFCF7] border border-white/10 hover:border-[#E5A93C]/50 text-base font-semibold transition-all shadow-md"
              >
                <MapPin className="w-5 h-5 text-[#E5A93C]" />
                <span>Cómo Llegar</span>
              </a>

              <a
                href={restauranteData.telefonoHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-transparent hover:bg-white/5 text-[#E5A93C] border border-[#E5A93C]/40 text-base font-semibold transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>{restauranteData.telefono}</span>
              </a>
            </div>

            {/* Micro-datos destacados */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-[#FCD34D]">07:00</p>
                <p className="text-xs text-[#A8A29E]">Desayunos desde temprano</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-[#FCD34D]">100%</p>
                <p className="text-xs text-[#A8A29E]">Recetas y guisos caseros</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-serif text-[#FCD34D]">Terraza</p>
                <p className="text-xs text-[#A8A29E]">Exterior & Salón interior</p>
              </div>
            </div>
          </div>

          {/* Composición Visual Derecha: Especialidad Croqueta & Bodegón */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#241E18] to-[#12100E] border border-[#E5A93C]/30 shadow-2xl p-2 group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/assets/imagenes/platos/croquetas-jamon.svg"
                  alt="Croquetas cremosas de jamón ibérico en El Cantinero Tapas Sevilla"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Insignia flotante gastronómica */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0E0D0B]/90 backdrop-blur-md rounded-xl p-3 border border-[#E5A93C]/30 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#E5A93C]/20 flex items-center justify-center text-[#FCD34D]">
                    <Award className="w-5 h-5 text-[#E5A93C]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FDFCF7] leading-tight">Croquetas de Jamón Ibérico</p>
                    <p className="text-[11px] text-[#A8A29E] leading-tight">Firma crujiente y bechamel sedosa</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#FCD34D] bg-[#E5A93C]/10 px-2.5 py-1 rounded-md border border-[#E5A93C]/20">
                  3,50 €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
