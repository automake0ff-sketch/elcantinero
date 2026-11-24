'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, QrCode, Download, Printer, Plus, X, Eye } from 'lucide-react';
import QRCode from 'qrcode';
import { MesaQR } from '@/lib/types';

export default function AdminQRPage() {
  const [mesas, setMesas] = useState<MesaQR[]>([]);
  const [generalQRData, setGeneralQRData] = useState<string>('');
  const [selectedMesaQR, setSelectedMesaQR] = useState<{ mesa: MesaQR; dataUrl: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [nuevaMesaNum, setNuevaMesaNum] = useState<number>(1);
  const [nuevaMesaNombre, setNuevaMesaNombre] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://elcantinerotapas.es';

  useEffect(() => {
    // Cargar QR general de la carta
    QRCode.toDataURL(`${baseUrl}/carta`, {
      width: 450,
      margin: 2,
      color: { dark: '#0E0D0B', light: '#FFFFFF' },
    }).then(setGeneralQRData);

    // Cargar listado de mesas
    fetch('/api/admin/qr')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setMesas(data.mesas);
          // Calcular sugerencia de siguiente mesa
          const maxNum = data.mesas.reduce((acc: number, m: MesaQR) => Math.max(acc, m.numeroMesa), 0);
          setNuevaMesaNum(maxNum + 1);
        }
      });
  }, [baseUrl]);

  const handleVerQR = async (mesa: MesaQR) => {
    const url = mesa.numeroMesa === 0 ? `${baseUrl}/carta` : `${baseUrl}/carta?mesa=${mesa.numeroMesa}`;
    const dataUrl = await QRCode.toDataURL(url, {
      width: 500,
      margin: 2,
      color: { dark: '#0E0D0B', light: '#FFFFFF' },
    });
    setSelectedMesaQR({ mesa, dataUrl });
  };

  const handleDescargarPNG = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.png`;
    link.click();
  };

  const handleDescargarSVG = async (mesa: MesaQR) => {
    const url = mesa.numeroMesa === 0 ? `${baseUrl}/carta` : `${baseUrl}/carta?mesa=${mesa.numeroMesa}`;
    const svg = await QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      color: { dark: '#0E0D0B', light: '#FFFFFF' },
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `QR-${mesa.nombre.replace(/\s+/g, '-')}.svg`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleCrearMesa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroMesa: nuevaMesaNum, nombre: nuevaMesaNombre }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMesas((prev) => [...prev, data.mesa]);
        setIsCreating(false);
        setNuevaMesaNombre('');
        setNuevaMesaNum((prev) => prev + 1);
        setFeedback('Mesa y QR creados con éxito');
      } else {
        alert(data.error || 'Error creando mesa');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  const handleToggleMesa = async (mesa: MesaQR) => {
    const updated = { ...mesa, activa: !mesa.activa };
    const res = await fetch('/api/admin/qr', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setMesas((prev) => prev.map((m) => (m.id === mesa.id ? updated : m)));
    }
  };

  const handleImprimirHoja = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-[#FDFCF7] pb-24">
      {/* Cabecera del módulo */}
      <div className="bg-[#14120F] border-b border-white/10 py-5 px-4 sm:px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-[#A8A29E] hover:text-[#E5A93C] transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Panel Principal</span>
            </Link>
            <h1 className="font-serif text-2xl font-bold text-[#FDFCF7] flex items-center gap-2">
              <QrCode className="w-6 h-6 text-[#E5A93C]" />
              Códigos QR y Mesas
            </h1>
            <p className="text-xs text-[#A8A29E]">
              Generación de códigos QR vectoriales (SVG) y en alta resolución para mesas de terraza y sala
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleImprimirHoja}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25221E] hover:bg-[#2E2A25] text-xs font-semibold text-[#FDFCF7] border border-white/10 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#E5A93C]" />
              <span>Imprimir Hoja de QRs</span>
            </button>

            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#C98A26] text-[#0E0D0B] font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Mesa</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between print:hidden">
            <span>{feedback}</span>
            <button onClick={() => setFeedback(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tarjeta de QR General de la Carta */}
        <div className="bg-[#181613] rounded-3xl p-6 sm:p-8 border border-[#E5A93C]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 print:hidden">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-xs font-semibold text-[#FCD34D] uppercase tracking-wider">
              Código QR Principal
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#FDFCF7]">
              QR General de la Carta Digital
            </h2>
            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Este código QR dirige directamente a <code className="text-[#E5A93C]">{baseUrl}/carta</code>. Ideal para cartelería exterior, barra, entrada y servilleteros.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleDescargarPNG(generalQRData, 'QR-General-El-Cantinero')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25221E] hover:bg-[#E5A93C] text-[#FDFCF7] hover:text-[#0E0D0B] text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar PNG
              </button>
              <button
                onClick={() => handleDescargarSVG({ id: 'general', numeroMesa: 0, nombre: 'Carta General', activa: true, totalEscaneos: 0, fechaCreacion: '' })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25221E] hover:bg-[#E5A93C] text-[#FDFCF7] hover:text-[#0E0D0B] text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar SVG (Vectorial)
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-[#E5A93C]/30 text-center shrink-0">
            {generalQRData ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={generalQRData} alt="QR General El Cantinero Tapas" className="w-44 h-44 mx-auto" />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-500">Generando...</div>
            )}
            <p className="text-[11px] font-bold text-stone-900 mt-2 uppercase tracking-wider">
              Carta Digital
            </p>
          </div>
        </div>

        {/* Listado y Tabla de Mesas */}
        <div className="space-y-4 print:hidden">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#FDFCF7]">
              Códigos QR Individuales por Mesa
            </h2>
            <span className="text-xs text-[#A8A29E]">{mesas.length} mesas configuradas</span>
          </div>

          <div className="bg-[#181613] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#12100E] border-b border-white/10 text-[#A8A29E] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Mesa / Número</th>
                    <th className="py-3.5 px-4">Ubicación / Nombre</th>
                    <th className="py-3.5 px-4">Enlace Permanente</th>
                    <th className="py-3.5 px-4">Total Escaneos</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mesas.map((m) => (
                    <tr key={m.id} className="hover:bg-[#1F1C18] transition-colors">
                      <td className="py-3.5 px-4 font-serif text-sm font-bold text-[#FCD34D]">
                        {m.numeroMesa === 0 ? 'QR General' : `Mesa ${m.numeroMesa}`}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#FDFCF7]">{m.nombre}</td>
                      <td className="py-3.5 px-4 text-[#A8A29E] font-mono text-[11px]">
                        /carta{m.numeroMesa > 0 ? `?mesa=${m.numeroMesa}` : ''}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#E5A93C]">{m.totalEscaneos || 0}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleMesa(m)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            m.activa
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {m.activa ? '✓ Activo' : '✕ Pausado'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerQR(m)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25221E] hover:bg-[#E5A93C] text-[#FDFCF7] hover:text-[#0E0D0B] font-bold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver / Descargar</span>
                          </button>
                          <button
                            onClick={() => handleDescargarSVG(m)}
                            className="p-1.5 rounded-lg bg-[#25221E] hover:bg-[#E5A93C] text-[#A8A29E] hover:text-[#0E0D0B] transition-colors"
                            title="Descargar SVG Vectorial"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hoja Imprimible (Visible solo al imprimir con Ctrl+P o botón) */}
        <div className="hidden print:block p-8 bg-white text-black">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-3xl font-black font-serif uppercase tracking-widest text-black">
              EL CANTINERO TAPAS
            </h1>
            <p className="text-sm font-semibold tracking-wider text-stone-700">
              Calle Periodista Juan Tribuna, 5 &middot; Sevilla Este
            </p>
            <p className="text-xs text-stone-600 mt-1">Escanee el código QR para consultar la carta digital en su móvil</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {mesas.filter((m) => m.activa).map((m) => (
              <div key={m.id} className="border-2 border-dashed border-stone-400 p-6 rounded-2xl text-center page-break-inside-avoid">
                <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border border-black mb-2 relative">
                  <Image src="/assets/imagenes/identidad/logo-oficial.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <h3 className="text-xl font-black uppercase text-black">
                  {m.numeroMesa === 0 ? 'CARTA DIGITAL' : `MESA ${m.numeroMesa}`}
                </h3>
                <p className="text-xs text-stone-600 mb-4">{m.nombre}</p>

                {/* QR en la hoja */}
                <div className="w-40 h-40 mx-auto bg-stone-100 flex items-center justify-center p-2 rounded-xl border border-stone-300">
                  <span className="text-[10px] text-stone-500 font-mono">
                    {baseUrl}/carta{m.numeroMesa > 0 ? `?mesa=${m.numeroMesa}` : ''}
                  </span>
                </div>
                <p className="text-[11px] font-bold mt-3 text-stone-800">
                  🥟 Disfruta de nuestras tapas y raciones caseras
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Previsualización y Descarga Individual */}
      {selectedMesaQR && (
        <div
          role="dialog"
          aria-label="Previsualización de código QR"
          className="fixed inset-0 z-50 bg-[#0E0D0B]/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMesaQR(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#181613] rounded-3xl p-6 border border-[#E5A93C]/40 shadow-2xl text-center space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#FDFCF7]">
                {selectedMesaQR.mesa.nombre}
              </h3>
              <button
                onClick={() => setSelectedMesaQR(null)}
                className="p-1 rounded-lg text-[#A8A29E] hover:text-[#FDFCF7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-inner text-center">
              <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border border-black mb-2">
                <Image src="/assets/imagenes/identidad/logo-oficial.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <p className="font-serif font-black text-stone-900 text-lg uppercase tracking-wide">
                {selectedMesaQR.mesa.numeroMesa === 0 ? 'EL CANTINERO' : `MESA ${selectedMesaQR.mesa.numeroMesa}`}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedMesaQR.dataUrl} alt="QR Mesa" className="w-48 h-48 mx-auto my-2" />
              <p className="text-[10px] text-stone-600 font-mono">
                /carta{selectedMesaQR.mesa.numeroMesa > 0 ? `?mesa=${selectedMesaQR.mesa.numeroMesa}` : ''}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleDescargarPNG(selectedMesaQR.dataUrl, `QR-${selectedMesaQR.mesa.nombre}`)}
                className="flex-1 py-2.5 rounded-xl bg-[#E5A93C] text-[#0E0D0B] font-bold text-xs"
              >
                Descargar PNG
              </button>
              <button
                onClick={() => handleDescargarSVG(selectedMesaQR.mesa)}
                className="flex-1 py-2.5 rounded-xl bg-[#25221E] hover:bg-[#2E2A25] text-[#FDFCF7] font-semibold text-xs border border-white/10"
              >
                Descargar SVG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Mesa */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-[#0E0D0B]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#181613] rounded-3xl p-6 border border-[#E5A93C]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#FDFCF7]">Configurar Nueva Mesa</h3>
              <button onClick={() => setIsCreating(false)} className="text-[#A8A29E] hover:text-[#FDFCF7]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearMesa} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Número de Mesa</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={nuevaMesaNum}
                  onChange={(e) => setNuevaMesaNum(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div>
                <label className="block text-[#A8A29E] font-semibold mb-1">Nombre o Ubicación Descriptiva</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mesa 5 (Terraza Principal)"
                  value={nuevaMesaNombre}
                  onChange={(e) => setNuevaMesaNombre(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12100E] border border-white/10 text-[#FDFCF7]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-[#25221E] text-[#FDFCF7]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E5A93C] text-[#0E0D0B] font-bold"
                >
                  Guardar Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
