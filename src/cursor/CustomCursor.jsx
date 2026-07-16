import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCursorContext, CURSOR_INTENTS } from "./CursorContext";

const INTENT_CONFIG = {
  [CURSOR_INTENTS.DEFAULT]: {
    bg: "rgba(255, 255, 255, 0.18)",
    borderColor: "rgba(255, 255, 255, 0.45)",
    borderWidth: "1px",
    opacity: 1,
  },
  [CURSOR_INTENTS.BUTTON]: {
    bg: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.35)",
    borderWidth: "1px",
    opacity: 1,
  },
  [CURSOR_INTENTS.INPUT]: {
    bg: "transparent",
    borderColor: "transparent",
    borderWidth: "0px",
    opacity: 0,
  },
};

export default function CustomCursor() {
  const { intent, isActive, cursorX, cursorY, cursorW, cursorH, cursorR } =
    useCursorContext();
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show cursor only after first mouse move
  useEffect(() => {
    if (!isActive) return;
    const show = () => setIsVisible(true);
    window.addEventListener("mousemove", show, { once: true });
    return () => window.removeEventListener("mousemove", show);
  }, [isActive]);

  // Hide cursor when mouse leaves window
  useEffect(() => {
    if (!isActive) return;
    const hide = () => setIsVisible(false);
    const show = () => setIsVisible(true);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    return () => {
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, [isActive]);

  // Apply cursor:none to body
  useEffect(() => {
    if (!isActive || prefersReduced) return;
    document.body.classList.add("custom-cursor-active");
    return () => document.body.classList.remove("custom-cursor-active");
  }, [isActive, prefersReduced]);

  if (!mounted || !isActive || prefersReduced) return null;

  const config = INTENT_CONFIG[intent] || INTENT_CONFIG[CURSOR_INTENTS.DEFAULT];

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: cursorX,
        top: cursorY,
        width: cursorW,
        height: cursorH,
        borderRadius: cursorR,
        x: "-50%",
        y: "-50%",
        borderStyle: "solid",
        willChange: "left, top, width, height, border-radius",
        mixBlendMode: "difference",
      }}
      animate={{
        backgroundColor: config.bg,
        borderWidth: config.borderWidth,
        borderColor: config.borderColor,
        opacity: isVisible ? config.opacity : 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    />
  );
}
