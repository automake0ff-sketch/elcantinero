'use client';

import React from 'react';
import Image from 'next/image';
import { X, Award, ShieldAlert, CheckCircle2, Share2, Sparkles } from 'lucide-react';
import { Plato, AlergenoItem } from '@/lib/types';

interface PlatoModalProps {
  plato: Plato;
  alergenosCatalogo: AlergenoItem[];
  onClose: () => void;
}

export default function PlatoModal({ plato, alergenosCatalogo, onClose }: PlatoModalProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${plato.nombre} - El Cantinero Tapas Sevilla`,
        text: `Descubre este plato en El Cantinero Tapas: ${plato.nombre}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div
      role="dialog"
      aria-label={`Detalle del plato ${plato.nombre}`}
      className="fixed inset-0 z-50 bg-[#0E0D0B]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#181613] rounded-3xl overflow-hidden border border-[#E5A93C]/40 shadow-2xl my-8 text-left animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen del plato en cabecera */}
        <div className="relative aspect-[16/9] w-full bg-[#241E18]">
          <Image
            src={plato.imagen}
            alt={plato.nombre}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181613] via-transparent to-transparent" />

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#0E0D0B]/80 text-[#FDFCF7] hover:bg-[#E5A93C] hover:text-[#0E0D0B] transition-colors"
            aria-label="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Etiquetas */}
          <div className="absolute bottom-4 left-6 flex flex-wrap gap-2">
            {plato.destacado && (
              <span className="bg-[#E5A93C] text-[#0E0D0B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                ★ Especialidad de la Casa
              </span>
            )}
            {plato.etiquetas?.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#0E0D0B]/85 text-[#FDFCF7] border border-white/20 text-xs font-semibold px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cuerpo de la ficha */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFCF7]">
                {plato.nombre}
              </h2>
              <p className="text-xs text-[#E5A93C] font-semibold tracking-wider uppercase mt-1">
                Cocina Tradicional Sevillana
              </p>
            </div>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-[#25221E] hover:bg-[#2E2A25] text-[#A8A29E] hover:text-[#E5A93C] border border-white/10 transition-colors"
              title="Compartir plato"
              aria-label="Compartir este plato"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Descripción gastronómica */}
          <p className="text-sm sm:text-base text-[#D6D3D1] leading-relaxed">
            {plato.descripcion}
          </p>

          {/* Precios oficiales */}
          <div className="p-4 rounded-2xl bg-[#14120F] border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#A8A29E] uppercase tracking-wider">Formato y Precio</span>
              <div className="flex items-center gap-6">
                {plato.precioTapa && (
                  <div>
                    <span className="text-xs text-[#A8A29E]">Tapa: </span>
                    <span className="text-lg font-bold text-[#FCD34D]">{plato.precioTapa.toFixed(2)} €</span>
                  </div>
                )}
                {plato.precioRacion && (
                  <div>
                    <span className="text-xs text-[#A8A29E]">Ración: </span>
                    <span className="text-lg font-bold text-[#FCD34D]">{plato.precioRacion.toFixed(2)} €</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disponible hoy
              </span>
            </div>
          </div>

          {/* Alérgenos verificados reglamentarios UE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDFCF7] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#E5A93C]" />
              Información de Alérgenos (Reglamento UE 1169/2011)
            </h4>
            {plato.alergenos && plato.alergenos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {plato.alergenos.map((code) => {
                  const item = alergenosCatalogo.find((a) => a.codigo === code);
                  return (
                    <div
                      key={code}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25221E] border border-white/10 text-xs text-[#FDFCF7]"
                    >
                      <span>{item?.icono || '⚠️'}</span>
                      <span className="font-medium">{item ? item.nombre : code}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-emerald-400">
                Este plato no contiene los alérgenos comunes catalogados. Consulta al personal para dietas específicas.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 text-[11px] text-[#78716C]">
            * Precios con IVA incluido. Si tiene alguna intolerancia grave o alergia, comuníquelo siempre al camarero antes de ordenar.
          </div>
        </div>
      </div>
    </div>
  );
}
