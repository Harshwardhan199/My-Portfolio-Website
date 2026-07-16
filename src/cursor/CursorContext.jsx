import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useMotionValue, useSpring } from "framer-motion";

export const CURSOR_INTENTS = {
  DEFAULT: "default",
  BUTTON: "button",
  INPUT: "input",
};

const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [intent, setIntentState] = useState(CURSOR_INTENTS.DEFAULT);
  const [isActive, setIsActive] = useState(false);
  const [hoveredEl, setHoveredEl] = useState(null);
  const intentRef = useRef(CURSOR_INTENTS.DEFAULT);

  // Check if fine pointer is available (non-touch desktop)
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsActive(mq.matches);
    const handler = (e) => setIsActive(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Spring-based motion values for position, width, height, and border radius
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const rawWidth = useMotionValue(14);
  const rawHeight = useMotionValue(14);
  const rawRadius = useMotionValue(9999);

  // Ultrafast responsive spring configuration for near-instant 1:1 tracking
  const springConfig = { stiffness: 1600, damping: 50, mass: 0.1 };
  // Snappier spring configuration specifically for size expansion and morphing
  const sizeSpringConfig = { stiffness: 2000, damping: 45, mass: 0.05 };

  const cursorX = useSpring(rawX, springConfig);
  const cursorY = useSpring(rawY, springConfig);
  const cursorW = useSpring(rawWidth, sizeSpringConfig);
  const cursorH = useSpring(rawHeight, sizeSpringConfig);
  const cursorR = useSpring(rawRadius, sizeSpringConfig);

  // Track raw mouse coordinates when not hovering an interactive element
  useEffect(() => {
    if (!isActive) return;
    const move = (e) => {
      if (!hoveredEl) {
        rawX.set(e.clientX);
        rawY.set(e.clientY);
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [isActive, hoveredEl, rawX, rawY]);

  // requestAnimationFrame loop to track element size, position, and border-radius
  useEffect(() => {
    if (!isActive) return;

    if (!hoveredEl) {
      rawWidth.set(14);
      rawHeight.set(14);
      rawRadius.set(9999);
      return;
    }

    let active = true;
    const updateBounds = () => {
      if (!active || !hoveredEl) return;

      const rect = hoveredEl.getBoundingClientRect();
      const style = window.getComputedStyle(hoveredEl);
      const borderRadius = parseFloat(style.borderRadius) || 0;

      // Position target at the center of the hovered element
      rawX.set(rect.left + rect.width / 2);
      rawY.set(rect.top + rect.height / 2);

      // Width and height with 8px padding on all sides (16px total)
      rawWidth.set(rect.width + 16);
      rawHeight.set(rect.height + 16);
      rawRadius.set(borderRadius + 8);

      requestAnimationFrame(updateBounds);
    };

    requestAnimationFrame(updateBounds);
    return () => {
      active = false;
    };
  }, [hoveredEl, rawX, rawY, rawWidth, rawHeight, rawRadius, isActive]);

  const setIntent = useCallback((type) => {
    intentRef.current = type;
    setIntentState(type);
  }, []);

  const resetIntent = useCallback(() => {
    intentRef.current = CURSOR_INTENTS.DEFAULT;
    setIntentState(CURSOR_INTENTS.DEFAULT);
  }, []);

  // Global event delegation for interactive elements (links, buttons) and text fields
  useEffect(() => {
    if (!isActive) return;

    const handleMouseOver = (e) => {
      const target = e.target.closest(
        'a, button, [role="button"], .clickable-cursor',
      );
      if (target && !target.matches("input, textarea, select")) {
        setHoveredEl(target);
        setIntent(CURSOR_INTENTS.BUTTON);
      } else {
        const isInput = e.target.closest("input, textarea, select");
        if (isInput) {
          setIntent(CURSOR_INTENTS.INPUT);
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest(
        'a, button, [role="button"], .clickable-cursor',
      );
      if (target && !target.matches("input, textarea, select")) {
        const related = e.relatedTarget
          ? e.relatedTarget.closest(
              'a, button, [role="button"], .clickable-cursor',
            )
          : null;
        if (!related) {
          setHoveredEl(null);
          resetIntent();
        }
      } else {
        const isInput = e.target.closest("input, textarea, select");
        if (isInput) {
          resetIntent();
        }
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isActive, resetIntent, setIntent]);

  return (
    <CursorContext.Provider
      value={{
        intent,
        isActive,
        cursorX,
        cursorY,
        cursorW,
        cursorH,
        cursorR,
        rawX,
        rawY,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursorContext() {
  const ctx = useContext(CursorContext);
  if (!ctx)
    throw new Error("useCursorContext must be used inside CursorProvider");
  return ctx;
}
