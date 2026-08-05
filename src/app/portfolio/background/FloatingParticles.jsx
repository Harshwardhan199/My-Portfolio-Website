import { useMemo, useEffect, useRef } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";

// Generate stable particle data once
function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,          // 2–5px
    x: Math.random() * 100,               // % from left
    y: Math.random() * 100,               // % from top
    opacity: 0.06 + Math.random() * 0.12, // 0.06–0.18
    duration: 30 + Math.random() * 50,    // 30–80s
    delay: -(Math.random() * 60),         // negative = already mid-animation
    drift: (Math.random() - 0.5) * 120,   // horizontal drift range (px)
    parallaxFactor: 0.5 + Math.random() * 1.5, // depth multiplier
  }));
}

export default function FloatingParticles() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef(null);
  const particles = useMemo(() => generateParticles(18), []);

  // Mouse parallax via spring motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 40, damping: 20, mass: 1 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  useEffect(() => {
    if (prefersReduced) return;
    const move = (e) => {
      // Normalize to -1 .. 1 range from center of viewport
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(nx * 8); // max ±8px base shift
      rawY.set(ny * 8);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY, prefersReduced]);

  // Update particle positions via DOM subscription — no re-renders
  useEffect(() => {
    if (prefersReduced) return;
    const els = containerRef.current?.querySelectorAll("[data-particle]");
    if (!els) return;

    const unsub = [
      springX.on("change", update),
      springY.on("change", update),
    ];

    function update() {
      const sx = springX.get();
      const sy = springY.get();
      els.forEach((el) => {
        const factor = parseFloat(el.dataset.factor || "1");
        el.style.transform = `translate(${sx * factor}px, ${sy * factor}px)`;
      });
    }

    return () => unsub.forEach((u) => u());
  }, [springX, springY, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          data-particle
          data-factor={p.parallaxFactor.toFixed(2)}
          className="absolute rounded-full bg-brand-red will-change-transform"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
