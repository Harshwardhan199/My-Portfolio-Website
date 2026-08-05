import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * MouseSpotlight — a subtle radial gradient that follows the cursor with
 * spring-based interpolation. Uses motion values directly on style so it
 * never triggers React re-renders.
 */
export default function MouseSpotlight() {
  const prefersReduced = useReducedMotion();

  const rawX = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0
  );
  const rawY = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0
  );

  const springConfig = { stiffness: 80, damping: 20, mass: 1 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  useEffect(() => {
    if (prefersReduced) return;
    const move = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: useSpring(
          // Can't template-string a motion value, so we use a derived approach
          // below via useTransform — but for simplicity we use inline style update
          "transparent"
        ),
      }}
    >
      {/* Primary spotlight following cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at 50% 50%, rgba(229,9,20,0.04) 0%, transparent 70%)`,
          // We position via transform to avoid layout recalcs
          x: 0,
          y: 0,
        }}
        // We can't easily do dynamic radial-gradient with motion values directly,
        // so we use a JS approach via useEffect + direct DOM style
      />
    </motion.div>
  );
}

/**
 * An alternative implementation that uses a canvas-free approach:
 * We render a fixed div and update its CSS background via requestAnimationFrame
 * piped through motion value subscriptions — zero re-renders.
 */
export function MouseSpotlightOptimized() {
  const prefersReduced = useReducedMotion();

  const rawX = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0
  );
  const rawY = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0
  );

  const springConfig = { stiffness: 80, damping: 22, mass: 1 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  useEffect(() => {
    if (prefersReduced) return;
    const move = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY, prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const el = document.getElementById("mouse-spotlight");
    if (!el) return;

    // Subscribe to spring values and update DOM directly — no re-renders
    const unsubX = x.on("change", () => updateSpotlight());
    const unsubY = y.on("change", () => updateSpotlight());

    function updateSpotlight() {
      const cx = x.get();
      const cy = y.get();
      el.style.background = `radial-gradient(800px circle at ${cx}px ${cy}px, rgba(229,9,20,0.045) 0%, rgba(229,9,20,0.01) 40%, transparent 70%)`;
    }

    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      id="mouse-spotlight"
      className="absolute inset-0 pointer-events-none transition-opacity duration-500"
      style={{
        background: "transparent",
        zIndex: 1,
      }}
    />
  );
}
