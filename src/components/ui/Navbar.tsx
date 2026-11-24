'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Menu as MenuIcon, X, Utensils, Clock, Lock } from 'lucide-react';
import restauranteData from '@/data/restaurante.json';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0E0D0B]/95 backdrop-blur-md border-b border-[#E5A93C]/20 shadow-xl py-3'
          : 'bg-gradient-to-b from-[#0E0D0B]/90 via-[#0E0D0B]/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo Oficial */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#E5A93C] to-[#B45309] p-0.5 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
            <div className="relative w-full h-full bg-[#181613] rounded-full overflow-hidden">
              <Image
                src="/assets/imagenes/identidad/logo-oficial.jpg"
                alt="Logotipo oficial de El Cantinero Tapas Sevilla"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#FDFCF7] group-hover:text-[#E5A93C] transition-colors leading-tight">
              EL CANTINERO
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-[#E5A93C] font-semibold uppercase leading-tight">
              Tapas &middot; Sevilla Este
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link
            href="/carta"
            className="text-[#FDFCF7] hover:text-[#E5A93C] flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Utensils className="w-4 h-4 text-[#E5A93C]" />
            Carta Digital
          </Link>
          <Link
            href="/#especialidades"
            className="text-[#A8A29E] hover:text-[#FDFCF7] transition-colors"
          >
            Especialidades
          </Link>
          <Link
            href="/#historia"
            className="text-[#A8A29E] hover:text-[#FDFCF7] transition-colors"
          >
            Nuestra Historia
          </Link>
          <Link
            href="/#galeria"
            className="text-[#A8A29E] hover:text-[#FDFCF7] transition-colors"
          >
            Galería
          </Link>
          <Link
            href="/#contacto"
            className="text-[#A8A29E] hover:text-[#FDFCF7] transition-colors"
          >
            Contacto & Horario
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={restauranteData.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-[#1A1815] text-[#A8A29E] hover:text-[#E5A93C] hover:bg-[#25221E] border border-white/5 transition-all"
            title="Cómo llegar (Google Maps)"
            aria-label="Abrir Google Maps"
          >
            <MapPin className="w-4 h-4" />
          </a>
          <a
            href={restauranteData.telefonoHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#E5A93C] to-[#C98A26] text-[#0E0D0B] font-bold text-sm tracking-wide shadow-md hover:shadow-[#E5A93C]/30 hover:scale-105 active:scale-95 transition-all"
            aria-label={`Llamar al restaurante: ${restauranteData.telefono}`}
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>{restauranteData.telefono}</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="md:hidden p-2 rounded-lg bg-[#1A1815] text-[#FDFCF7] border border-[#E5A93C]/20 hover:text-[#E5A93C]"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#12110E] border-b border-[#E5A93C]/20 px-4 pt-3 pb-6 mt-3 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 font-medium text-base">
            <Link
              href="/carta"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#E5A93C]/10 text-[#E5A93C] font-semibold border border-[#E5A93C]/30"
            >
              <span className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Consultar Carta Completa
              </span>
              <span className="text-xs bg-[#E5A93C] text-[#0E0D0B] px-2 py-0.5 rounded-full font-bold">Ver</span>
            </Link>
            <Link
              href="/#especialidades"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-lg text-[#FDFCF7] hover:bg-[#1A1815]"
            >
              Especialidades & Croquetas
            </Link>
            <Link
              href="/#historia"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-lg text-[#FDFCF7] hover:bg-[#1A1815]"
            >
              Nuestra Historia
            </Link>
            <Link
              href="/#galeria"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-lg text-[#FDFCF7] hover:bg-[#1A1815]"
            >
              Galería de Fotos
            </Link>
            <Link
              href="/#contacto"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-lg text-[#FDFCF7] hover:bg-[#1A1815]"
            >
              Contacto & Horarios
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-lg text-xs text-[#A8A29E] flex items-center gap-2 hover:text-[#E5A93C]"
            >
              <Lock className="w-3.5 h-3.5" /> Acceso Propietario (/admin)
            </Link>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <a
              href={restauranteData.telefonoHref}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E5A93C] text-[#0E0D0B] font-bold text-center shadow-lg"
            >
              <Phone className="w-5 h-5 fill-current" />
              Llamar al {restauranteData.telefono}
            </a>
            <a
              href={restauranteData.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1F1C18] text-[#FDFCF7] border border-white/10 font-medium text-center"
            >
              <MapPin className="w-5 h-5 text-[#E5A93C]" />
              Cómo llegar (Google Maps)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
