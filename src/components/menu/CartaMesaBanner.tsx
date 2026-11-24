'use client';

import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { QrCode, CheckCircle2 } from 'lucide-react';

export default function CartaMesaBanner() {
  const searchParams = useSearchParams();
  const mesa = searchParams.get('mesa');
  const hasTracked = useRef(false);

  useEffect(() => {
    if (mesa && !hasTracked.current) {
      hasTracked.current = true;
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'escaneo_qr', entidadId: mesa }),
      }).catch(() => {});
    }
  }, [mesa]);

  if (!mesa) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#241E18] to-[#181613] border border-[#E5A93C]/40 flex items-center justify-between gap-4 shadow-xl animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/20 border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] shrink-0">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#FCD34D] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Acceso desde Mesa {mesa}
          </p>
          <p className="text-[11px] text-[#A8A29E]">
            ¡Bienvenido a El Cantinero Tapas! Consulta los platos y avisa a nuestro personal en sala para tomarte nota.
          </p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/20 px-2.5 py-1 rounded-full whitespace-nowrap hidden sm:inline">
        Atención en Mesa
      </span>
    </div>
  );
}
