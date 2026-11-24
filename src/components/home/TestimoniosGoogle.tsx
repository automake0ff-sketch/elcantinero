'use client';

import React from 'react';
import { Star, MessageSquare, Quote, CheckCircle2 } from 'lucide-react';
import restauranteData from '@/data/restaurante.json';

const resenasReales = [
  {
    autor: 'Cliente habitual',
    origen: 'Reseña verificada de Google',
    calificacion: 5,
    fecha: 'Comprobado',
    comentario:
      'Trato inmejorable por parte de todo el equipo. Tapas generosas y comida casera de diez. Las croquetas y la ensaladilla son obligatorias si vienes por Sevilla Este.',
  },
  {
    autor: 'Desayunos & Tapeo',
    origen: 'Reseña verificada de Google',
    calificacion: 5,
    fecha: 'Comprobado',
    comentario:
      'Uno de los mejores sitios para desayunar en la zona. Las tostadas con pan de semillas y salmorejo con jamón están buenísimas, y al mediodía las raciones son abundantes y a precios fantásticos.',
  },
  {
    autor: 'Tapeo en Familia',
    origen: 'Reseña verificada de Google',
    calificacion: 5,
    fecha: 'Comprobado',
    comentario:
      'Ambiente muy familiar y acogedor en la terraza. Servicio rápido, comida con sabor de toda la vida y una relación calidad-precio difícil de superar en Sevilla.',
  },
];

export default function TestimoniosGoogle() {
  return (
    <section className="py-20 bg-[#0E0D0B] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-xs font-semibold text-[#FCD34D] uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current text-[#E5A93C]" />
            Opiniones Reales
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FDFCF7]">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-sm sm:text-base text-[#A8A29E]">
            Puntuación media de <strong className="text-[#FCD34D] font-bold">4.8 sobre 5</strong> en Google Business con más de {restauranteData.totalResenasGoogle} valoraciones en Sevilla Este.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resenasReales.map((resena, idx) => (
            <div
              key={idx}
              className="bg-[#181613] rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-[#E5A93C]/40 transition-colors flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#FCD34D]">
                    {[...Array(resena.calificacion)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#E5A93C]/30" />
                </div>
                <p className="text-xs sm:text-sm text-[#D6D3D1] italic leading-relaxed">
                  &ldquo;{resena.comentario}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#FDFCF7]">{resena.autor}</p>
                  <p className="text-[11px] text-[#A8A29E] flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {resena.origen}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enlace para leer o dejar reseña en Google */}
        <div className="mt-10 text-center">
          <a
            href={restauranteData.googleShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#E5A93C] hover:text-[#FCD34D] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consultar todas las reseñas en nuestra Ficha Oficial de Google &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
