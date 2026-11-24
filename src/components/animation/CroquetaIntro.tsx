'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  type: 'crumb' | 'cream' | 'glow' | 'steam';
}

interface CroquetaIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function CroquetaIntro({ onComplete, forceShow = false }: CroquetaIntroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<'appear' | 'cracking' | 'burst' | 'brand' | 'finished'>('appear');
  const [brandOpacity, setBrandOpacity] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hasTriggeredBurst = useRef(false);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem('cantinero_intro_seen', 'true');
    } catch {
      // Ignore in private browsing
    }
    setPhase('finished');
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 400);
  }, [onComplete]);

  // Check sessionStorage and prefers-reduced-motion
  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('cantinero_intro_seen') === 'true';
    } catch {
      alreadySeen = false;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ((alreadySeen || reduced) && !forceShow) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, [forceShow, onComplete]);

  // Spawn culinary particles (panko crumbs, creamy droplets, aromatic glow)
  const spawnExplosionParticles = (centerX: number, centerY: number) => {
    const particles: Particle[] = [];
    const count = 160;

    const crumbColors = ['#FCD34D', '#F59E0B', '#D97706', '#B45309', '#FFE082', '#FFFBEB'];
    const creamColors = ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FFF'];
    const glowColors = ['#FCD34D', '#E5A93C', '#F59E0B'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Exponential speed distribution for a natural radial dispersion
      const speed = Math.pow(Math.random(), 0.6) * 7 + 1.2;
      const typeRand = Math.random();

      let type: 'crumb' | 'cream' | 'glow' | 'steam' = 'crumb';
      let color = crumbColors[Math.floor(Math.random() * crumbColors.length)];
      let size = Math.random() * 5 + 2;

      if (typeRand < 0.35) {
        type = 'cream';
        color = creamColors[Math.floor(Math.random() * creamColors.length)];
        size = Math.random() * 7 + 3;
      } else if (typeRand < 0.6) {
        type = 'glow';
        color = glowColors[Math.floor(Math.random() * glowColors.length)];
        size = Math.random() * 4 + 1.5;
      } else if (typeRand < 0.75) {
        type = 'steam';
        color = 'rgba(255, 245, 230, 0.4)';
        size = Math.random() * 14 + 6;
      }

      particles.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'steam' ? 1.5 : 0.5),
        size,
        color,
        alpha: 0.95,
        decay: Math.random() * 0.007 + 0.005,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        type,
      });
    }

    particlesRef.current = particles;
  };

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const totalDuration = 4600; // 4.6 seconds total

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / totalDuration, 1);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Stage progression
      if (elapsed < 1200) {
        setPhase('appear');
      } else if (elapsed < 2000) {
        setPhase('cracking');
      } else if (elapsed < 3200) {
        setPhase('burst');
        if (!hasTriggeredBurst.current) {
          hasTriggeredBurst.current = true;
          spawnExplosionParticles(cx, cy);
        }
      } else {
        setPhase('brand');
        const brandProgress = Math.min((elapsed - 3200) / 700, 1);
        setBrandOpacity(brandProgress);
      }

      // Draw background warm ambient glow
      const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.65);
      radial.addColorStop(0, 'rgba(45, 28, 12, 0.45)');
      radial.addColorStop(0.5, 'rgba(25, 20, 15, 0.7)');
      radial.addColorStop(1, 'rgba(14, 13, 11, 0.95)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // --- PHASE 1 & 2: Croqueta Golden Mesh ---
      if (elapsed < 3000) {
        ctx.save();
        ctx.translate(cx, cy);

        // Zoom in progression (scale from 0.6 to 1.15)
        let scale = 0.6 + Math.min(elapsed / 1800, 1) * 0.55;
        // Breathing hover
        const wobble = Math.sin(elapsed * 0.003) * 0.02;
        scale += wobble;
        ctx.scale(scale, scale);

        const crackAmount = elapsed > 1200 ? Math.min((elapsed - 1200) / 800, 1) : 0;
        const burstSpread = elapsed > 2000 ? Math.min((elapsed - 2000) / 900, 1) * 70 : 0;

        // Shadow under croqueta
        ctx.beginPath();
        ctx.ellipse(0, 70 + burstSpread * 0.2, 90, 25, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.filter = 'blur(12px)';
        ctx.fill();
        ctx.filter = 'none';

        // Croqueta Left Half
        ctx.save();
        ctx.translate(-burstSpread, 0);
        ctx.rotate(-burstSpread * 0.004);

        const gradLeft = ctx.createRadialGradient(-30, -10, 10, 0, 0, 85);
        gradLeft.addColorStop(0, '#FCD34D');
        gradLeft.addColorStop(0.3, '#E5A93C');
        gradLeft.addColorStop(0.7, '#B45309');
        gradLeft.addColorStop(1, '#78350F');

        ctx.beginPath();
        ctx.ellipse(-25, 0, 55, 42, -0.1, Math.PI * 0.5, Math.PI * 1.5);
        ctx.lineTo(-25 - crackAmount * 8, 42);
        ctx.lineTo(-25 - crackAmount * 8, -42);
        ctx.closePath();
        ctx.fillStyle = gradLeft;
        ctx.fill();

        // Panko texture specks left
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(-45, -15, 2.5, 0, Math.PI * 2);
        ctx.arc(-35, 12, 3, 0, Math.PI * 2);
        ctx.arc(-55, 5, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.arc(-40, -5, 2, 0, Math.PI * 2);
        ctx.arc(-28, 20, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Croqueta Right Half
        ctx.save();
        ctx.translate(burstSpread, 0);
        ctx.rotate(burstSpread * 0.004);

        const gradRight = ctx.createRadialGradient(30, -10, 10, 0, 0, 85);
        gradRight.addColorStop(0, '#FCD34D');
        gradRight.addColorStop(0.3, '#E5A93C');
        gradRight.addColorStop(0.7, '#B45309');
        gradRight.addColorStop(1, '#78350F');

        ctx.beginPath();
        ctx.ellipse(25, 0, 55, 42, 0.1, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.lineTo(25 + crackAmount * 8, 42);
        ctx.lineTo(25 + crackAmount * 8, -42);
        ctx.closePath();
        ctx.fillStyle = gradRight;
        ctx.fill();

        // Panko texture specks right
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(45, -12, 2.8, 0, Math.PI * 2);
        ctx.arc(38, 15, 2.4, 0, Math.PI * 2);
        ctx.arc(58, 2, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.arc(42, 0, 2.2, 0, Math.PI * 2);
        ctx.arc(28, -20, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Creamy Jamón Interior revealed when cracking
        if (crackAmount > 0) {
          ctx.save();
          const coreGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 35 + burstSpread * 0.5);
          coreGrad.addColorStop(0, '#FFFBEB');
          coreGrad.addColorStop(0.4, '#FEF3C7');
          coreGrad.addColorStop(0.8, '#F59E0B');
          coreGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, 15 + burstSpread * 0.8, 38, 0, 0, Math.PI * 2);
          ctx.fill();

          // Bits of Spanish Jamón inside
          ctx.fillStyle = '#991B1B';
          ctx.beginPath();
          ctx.rect(-6, -10, 12, 6);
          ctx.rect(-4, 8, 9, 5);
          ctx.fill();

          // Cracking glow line
          ctx.strokeStyle = '#FFFBEB';
          ctx.lineWidth = 3 * crackAmount;
          ctx.beginPath();
          ctx.moveTo(0, -38);
          ctx.lineTo(-4, -15);
          ctx.lineTo(4, 5);
          ctx.lineTo(0, 38);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      }

      // --- PHASE 3 & 4: Physics Particles (Explosion of Flavour) ---
      if (particlesRef.current.length > 0) {
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96; // Air drag
          p.vy *= 0.96;
          p.vy += 0.04; // Gentle gravity
          p.rotation += p.rotSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(p.alpha, 0);

          if (p.type === 'crumb') {
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.75);
          } else if (p.type === 'cream') {
            const creamGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, p.size);
            creamGrad.addColorStop(0, '#FFFFFF');
            creamGrad.addColorStop(0.7, p.color);
            creamGrad.addColorStop(1, 'rgba(254, 243, 199, 0)');
            ctx.fillStyle = creamGrad;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'glow') {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'steam') {
            ctx.fillStyle = p.color;
            ctx.filter = 'blur(4px)';
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.filter = 'none';
          }
          ctx.restore();
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        finishIntro();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible, finishIntro]);

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Animación de bienvenida El Cantinero Tapas"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0D0B] select-none transition-opacity duration-700 ${
        phase === 'finished' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Canvas for golden croqueta procedural animation & physics */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Brand title reveal during Phase 4 */}
      <div
        className="relative z-10 text-center px-4 max-w-2xl transition-all duration-700 transform"
        style={{
          opacity: brandOpacity,
          transform: `scale(${0.9 + brandOpacity * 0.1}) translateY(${brandOpacity ? 0 : 20}px)`,
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#FCD34D] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          Explosión de Sabor &middot; Sevilla Este
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-[#FDFCF7] drop-shadow-[0_4px_24px_rgba(229,169,60,0.35)] font-serif mb-2">
          EL CANTINERO
        </h1>
        <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent my-3" />
        <p className="text-lg sm:text-xl font-medium tracking-[0.3em] uppercase text-[#E5A93C]">
          TAPAS &middot; DESAYUNOS &middot; TRADICIÓN
        </p>
      </div>

      {/* Skip button always available and prominent */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={finishIntro}
          type="button"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917]/80 hover:bg-[#292524] text-[#E5A93C] border border-[#E5A93C]/40 hover:border-[#E5A93C] text-sm font-semibold tracking-wide backdrop-blur-md transition-all shadow-lg hover:shadow-[#E5A93C]/20 hover:scale-105 active:scale-95"
          aria-label="Saltar animación y entrar a la página principal"
        >
          <span>Entrar al Restaurante</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Accessibility bottom helper */}
      <div className="absolute bottom-6 text-center text-xs text-[#A8A29E]/70 tracking-wider">
        <span className="hidden sm:inline">Pase la bienvenida o pulse «Entrar» en cualquier momento</span>
      </div>
    </div>
  );
}
