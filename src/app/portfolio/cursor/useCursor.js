import { useCallback } from "react";
import { useCursorContext, CURSOR_INTENTS } from "./CursorContext";

/**
 * useCursor — returns event handlers to set/reset cursor intent.
 *
 * Usage:
 *   const cursorHandlers = useCursor("button");
 *   <button {...cursorHandlers}>Click me</button>
 *
 * Or manually:
 *   const { setIntent, resetIntent } = useCursor();
 */
export function useCursor(intent = CURSOR_INTENTS.DEFAULT) {
  const { setIntent, resetIntent, isActive } = useCursorContext();

  const onMouseEnter = useCallback(() => {
    if (isActive) setIntent(intent);
  }, [isActive, setIntent, intent]);

  const onMouseLeave = useCallback(() => {
    if (isActive) resetIntent();
  }, [isActive, resetIntent]);

  return { onMouseEnter, onMouseLeave };
}

export { CURSOR_INTENTS };
