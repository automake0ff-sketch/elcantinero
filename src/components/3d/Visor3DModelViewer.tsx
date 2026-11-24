'use client';

import React, { useEffect, useState } from 'react';
import { Box } from 'lucide-react';

interface Visor3DModelViewerProps {
  nombrePlato: string;
  modelo3d?: {
    glb: string;
    usdz?: string;
  } | null;
}

/**
 * Visor 3D y Realidad Aumentada condicional
 * REGLA ESTRICTA: Solo se renderiza si existe un archivo 3D real confirmado en modelo3d.glb.
 * En ningún caso se muestran botones simulados o modelos falsos.
 */
export default function Visor3DModelViewer({
  nombrePlato,
  modelo3d,
}: Visor3DModelViewerProps) {
  const [modelViewerLoaded, setModelViewerLoaded] = useState(() => {
    return typeof window !== 'undefined' && Boolean(customElements.get('model-viewer'));
  });

  useEffect(() => {
    // Si no hay modelo 3D real configurado, no cargamos el script ni mostramos nada
    if (!modelo3d || !modelo3d.glb) {
      return;
    }

    // Comprobamos si el elemento personalizado ya está registrado
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      script.onload = () => setModelViewerLoaded(true);
      document.head.appendChild(script);
    }
  }, [modelo3d]);

  // Si no hay modelo 3D confirmado, no renderizamos absolutamente nada
  if (!modelo3d || !modelo3d.glb) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#14120F] border border-[#E5A93C]/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FCD34D]">
          <Box className="w-4 h-4 text-[#E5A93C]" />
          <span>Experiencia 3D y Realidad Aumentada</span>
        </div>
        <span className="text-[10px] text-[#A8A29E] bg-[#25221E] px-2 py-0.5 rounded-full">
          Modelo Interactivo Real
        </span>
      </div>

      <div className="relative aspect-[4/3] w-full bg-[#0E0D0B] rounded-xl overflow-hidden flex items-center justify-center">
        {modelViewerLoaded ? (
          // @ts-expect-error model-viewer es un custom web component
          <model-viewer
            src={modelo3d.glb}
            ios-src={modelo3d.usdz || undefined}
            alt={`Modelo 3D real de ${nombrePlato}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="text-center text-xs text-[#A8A29E] animate-pulse">
            Cargando visor 3D interactivo...
          </div>
        )}
      </div>

      <p className="text-[11px] text-[#78716C]">
        Puedes rotar el plato con el dedo o ratón. En teléfonos compatibles con AR (ARCore / iOS Quick Look), pulsa el icono de Realidad Aumentada para verlo sobre tu mesa.
      </p>
    </div>
  );
}
