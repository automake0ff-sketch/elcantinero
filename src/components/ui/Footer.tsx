'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Star, Play, Lock } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';
import TikTokIcon from '@/components/ui/TikTokIcon';
import restauranteData from '@/data/restaurante.json';

export default function Footer() {
  const handleReplayIntro = () => {
    try {
      sessionStorage.removeItem('cantinero_intro_seen');
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  return (
    <footer className="bg-[#090807] border-t border-white/10 text-[#A8A29E] pt-16 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Columna 1: Identidad & Google Rating */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E5A93C]/40 shrink-0">
                <Image
                  src="/assets/imagenes/identidad/logo-oficial.jpg"
                  alt="Logotipo oficial de El Cantinero Tapas"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#FDFCF7]">
                  EL CANTINERO TAPAS
                </h3>
                <p className="text-xs text-[#E5A93C] font-semibold tracking-wider uppercase">
                  Sevilla Este
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#A8A29E]">
              El auténtico sabor del tapeo sevillano y desayunos tradicionales. Tapas generosas, recetas caseras y trato cercano en la Calle Periodista Juan Tribuna.
            </p>
            {/* Google Rating Badge */}
            <a
              href={restauranteData.googleShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#181613] border border-[#E5A93C]/30 text-xs text-[#FDFCF7] hover:border-[#E5A93C] transition-colors"
            >
              <div className="flex text-[#FCD34D]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-[#FCD34D]">{restauranteData.valoracionGoogle} / 5</span>
              <span className="text-[11px] text-[#A8A29E]">({restauranteData.totalResenasGoogle}+ reseñas)</span>
            </a>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#FDFCF7] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Explorar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/carta" className="hover:text-[#E5A93C] transition-colors">
                  &rarr; Carta Digital Completa
                </Link>
              </li>
              <li>
                <Link href="/#especialidades" className="hover:text-[#E5A93C] transition-colors">
                  &rarr; Especialidades y Croquetas
                </Link>
              </li>
              <li>
                <Link href="/#historia" className="hover:text-[#E5A93C] transition-colors">
                  &rarr; Nuestra Historia
                </Link>
              </li>
              <li>
                <Link href="/#galeria" className="hover:text-[#E5A93C] transition-colors">
                  &rarr; Galería del Local
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-[#E5A93C] transition-colors">
                  &rarr; Ubicación y Horarios
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Horarios de Apertura */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#FDFCF7] uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E5A93C]" />
              Horario Habitual
            </h4>
            <ul className="space-y-2 text-xs">
              {restauranteData.horarios.map((item, idx) => (
                <li key={idx} className="flex flex-col border-b border-white/5 pb-1.5">
                  <div className="flex justify-between font-semibold text-[#FDFCF7]">
                    <span>{item.dias}</span>
                    <span className="text-[#E5A93C]">{item.horas}</span>
                  </div>
                  <span className="text-[11px] text-[#78716C]">{item.tipo}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Dónde Estamos y Contacto */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#FDFCF7] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Contacto Directo
            </h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span>{restauranteData.direccion}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <a href={restauranteData.telefonoHref} className="hover:text-[#E5A93C] font-semibold text-[#FDFCF7]">
                  {restauranteData.telefono}
                </a>
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={restauranteData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181613] hover:bg-[#25221E] text-xs font-semibold text-[#FDFCF7] border border-white/10 hover:border-[#E5A93C] transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Instagram</span>
                </a>
                <a
                  href={restauranteData.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181613] hover:bg-[#25221E] text-xs font-semibold text-[#FDFCF7] border border-white/10 hover:border-[#E5A93C] transition-colors"
                >
                  <TikTokIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separador inferior con botón de animación y acceso admin */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 El Cantinero Tapas. Sevilla Este.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleReplayIntro}
              type="button"
              className="inline-flex items-center gap-1.5 text-[#E5A93C] hover:text-[#FCD34D] transition-colors cursor-pointer"
              title="Volver a reproducir la animación de la croqueta"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Ver animación inicial de la croqueta
            </button>
            <span className="text-white/20">&middot;</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[#78716C] hover:text-[#A8A29E] transition-colors"
            >
              <Lock className="w-3 h-3" /> Panel Propietario (/admin)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
