import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Sparkles, Utensils } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import FloatingContactBar from '@/components/ui/FloatingContactBar';
import MenuExplorer from '@/components/menu/MenuExplorer';
import restauranteData from '@/data/restaurante.json';

export const metadata: Metadata = {
  title: 'Carta Digital de Tapas y Desayunos | El Cantinero Sevilla Este',
  description:
    'Explora nuestra carta digital: croquetas caseras de jamón ibérico, ensaladilla rusa, solomillo al whisky, desayunos con salmorejo y tapas tradicionales en Sevilla Este. C. Periodista Juan Tribuna, 5.',
  openGraph: {
    title: 'Carta Digital | El Cantinero Tapas Sevilla',
    description: 'Tapas caseras, raciones generosas y desayunos tradicionales en Sevilla Este.',
    images: ['/assets/imagenes/platos/croquetas-jamon.svg'],
  },
};

export default function CartaPage() {
  return (
    <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabecera de la carta */}
          <div className="mb-8 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#A8A29E] hover:text-[#E5A93C] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la portada principal</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-xs font-semibold text-[#FCD34D] uppercase tracking-wider mb-2">
                  <Utensils className="w-3.5 h-3.5 text-[#E5A93C]" />
                  Gastronomía Tradicional
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FDFCF7]">
                  Nuestra Carta Digital
                </h1>
                <p className="text-sm text-[#A8A29E] mt-1 max-w-xl">
                  Tapas, raciones y desayunos elaborados a diario. Precios con IVA incluido y tabla de alérgenos actualizada.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={restauranteData.telefonoHref}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5A93C] text-[#0E0D0B] font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Llamar al Bar</span>
                </a>
                <a
                  href={restauranteData.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#25221E] text-[#FDFCF7] border border-white/10 text-xs font-semibold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Cómo llegar</span>
                </a>
              </div>
            </div>
          </div>

          {/* Explorador interactivo */}
          <MenuExplorer />
        </div>
      </main>

      <Footer />
      <FloatingContactBar />
    </div>
  );
}
