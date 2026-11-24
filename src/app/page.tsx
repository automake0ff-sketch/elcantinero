import React from 'react';
import CroquetaIntro from '@/components/animation/CroquetaIntro';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/home/Hero';
import PromocionBanner from '@/components/home/PromocionBanner';
import Especialidades from '@/components/home/Especialidades';
import Historia from '@/components/home/Historia';
import Galeria from '@/components/home/Galeria';
import TestimoniosGoogle from '@/components/home/TestimoniosGoogle';
import ContactoSeccion from '@/components/home/ContactoSeccion';
import Footer from '@/components/ui/Footer';
import FloatingContactBar from '@/components/ui/FloatingContactBar';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0E0D0B] text-[#FDFCF7] flex flex-col">
      {/* Animación cinematográfica de la croqueta de bienvenida */}
      <CroquetaIntro />

      {/* Navegación Principal */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Principal con llamada a la carta y Google Maps */}
        <Hero />

        {/* Banner de Promoción Activa (solo visible si existe promoción vigente) */}
        <PromocionBanner />

        {/* Especialidades confirmadas (Croquetas, Ensaladilla, Solomillo...) */}
        <Especialidades />

        {/* Nuestra Historia en Sevilla Este */}
        <Historia />

        {/* Galería visual del local y terraza */}
        <Galeria />

        {/* Reputación real de Google (4.8★) */}
        <TestimoniosGoogle />

        {/* Dónde estamos, horarios, teléfono y mapa interactivo */}
        <ContactoSeccion />
      </main>

      {/* Pie de página y contacto */}
      <Footer />

      {/* Barra flotante de conversión para móviles */}
      <FloatingContactBar />
    </div>
  );
}
