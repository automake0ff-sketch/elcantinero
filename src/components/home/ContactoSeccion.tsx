'use client';

import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';
import TikTokIcon from '@/components/ui/TikTokIcon';
import restauranteData from '@/data/restaurante.json';

export default function ContactoSeccion() {
  return (
    <section id="contacto" className="py-20 bg-[#0E0D0B] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-xs font-semibold text-[#FCD34D] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
            Visítanos
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FDFCF7]">
            Dónde Estamos y Contacto
          </h2>
          <p className="text-sm sm:text-base text-[#A8A29E]">
            Te esperamos en Sevilla Este para desayunar o compartir el mejor tapeo tradicional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Ficha de datos verificados */}
          <div className="lg:col-span-5 bg-[#181613] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
            {/* Dirección */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E5A93C]">Dirección</p>
                <p className="font-serif text-lg font-bold text-[#FDFCF7]">{restauranteData.direccion}</p>
                <p className="text-xs text-[#A8A29E]">Zona {restauranteData.barrio}</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E5A93C]">Teléfono</p>
                <a
                  href={restauranteData.telefonoHref}
                  className="font-serif text-2xl font-bold text-[#FDFCF7] hover:text-[#E5A93C] transition-colors block"
                >
                  {restauranteData.telefono}
                </a>
                <p className="text-xs text-[#A8A29E]">Atención durante horario de servicio</p>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-4 pt-2 border-t border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#E5A93C]">Horario Semanal</p>
                <div className="space-y-1.5 text-xs">
                  {restauranteData.horarios.map((h, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-[#FDFCF7] font-medium">{h.dias}:</span>
                      <span className="text-[#E5A93C] font-semibold">{h.horas}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones de acción directa */}
            <div className="pt-4 flex flex-col sm:flex-row gap-2.5">
              <a
                href={restauranteData.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C98A26] text-[#0E0D0B] font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all text-center"
              >
                <Navigation className="w-3.5 h-3.5 fill-current" />
                Cómo llegar
              </a>
              <a
                href={restauranteData.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#25221E] hover:bg-[#2E2A25] text-[#FDFCF7] border border-white/10 font-semibold text-xs transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                Instagram
              </a>
              <a
                href={restauranteData.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#25221E] hover:bg-[#2E2A25] text-[#FDFCF7] border border-white/10 font-semibold text-xs transition-colors"
              >
                <TikTokIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                TikTok
              </a>
            </div>
          </div>

          {/* Tarjeta Visual de Mapa y Ubicación */}
          <div className="lg:col-span-7 bg-[#181613] rounded-3xl overflow-hidden border border-white/10 shadow-xl flex flex-col">
            <div className="p-6 bg-gradient-to-r from-[#1F1C18] to-[#14120F] border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FDFCF7]">
                  Ubicación en Google Maps
                </h3>
                <p className="text-xs text-[#A8A29E]">Calle Periodista Juan Tribuna, 5, 41020 Sevilla</p>
              </div>
              <a
                href={restauranteData.googleShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#E5A93C] hover:underline font-semibold"
              >
                Ficha Oficial <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Iframe oficial de Google Maps con ubicación exacta en C. Periodista Juan Tribuna 5 Sevilla */}
            <div className="relative w-full h-[380px] bg-[#0E0D0B]">
              <iframe
                title="Mapa de localización de El Cantinero Tapas Sevilla"
                src="https://maps.google.com/maps?q=Calle+Periodista+Juan+Tribuna+5+41020+Sevilla&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
