import { useReducedMotion } from "framer-motion";
import FloatingParticles from "./FloatingParticles";
import { MouseSpotlightOptimized } from "./MouseSpotlight";

/**
 * AnimatedBackground — fixed, full-screen layer composing all background effects:
 *
 * Layer 1: Animated Grid (CSS drift animation)
 * Layer 2: Floating Particles (CSS + mouse parallax)
 * Layer 3: Ambient radial orbs (static, very low opacity)
 * Layer 4: Noise texture (static SVG, 2–3% opacity)
 * Layer 5: Mouse spotlight (spring-interpolated radial gradient)
 */
export default function AnimatedBackground() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">

      {/* ─── Layer 1: Animated Grid ──────────────────────────────────────────── */}
      <div
        className={`absolute inset-0 bg-grid-pattern ${prefersReduced ? "" : "animate-grid-drift"}`}
        style={{ opacity: 1 }}
      />

      {/* ─── Layer 2: Floating Particles ────────────────────────────────────── */}
      <FloatingParticles />

      {/* ─── Layer 3: Ambient Radial Orbs ───────────────────────────────────── */}
      {/* Top-left warm accent */}
      <div
        className="absolute top-[-5%] left-[-8%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(229,9,20,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Bottom-right accent */}
      <div
        className="absolute bottom-[-8%] right-[-8%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(229,9,20,0.03) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Center subtle glow */}
      <div
        className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(229,9,20,0.015) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ─── Layer 4: Noise Texture ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-noise"
        style={{ opacity: 0.018 }}
      />

      {/* ─── Layer 5: Mouse Spotlight ────────────────────────────────────────── */}
      <MouseSpotlightOptimized />
    </div>
  );
}
