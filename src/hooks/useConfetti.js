import { useRef } from "react";
import confetti from "canvas-confetti";

export function useConfetti(options) {
  const ref = useRef();
  return [
    ref,
    () => {
      const mediaQuery = matchMedia("(prefers-reduced-motion: no-preference)");
      if (mediaQuery?.matches) {
        const {
          top,
          height,
          left,
          width
        } = ref.current.getBoundingClientRect();
        const y = (top + height / 2) / window.innerHeight;
        const x = (left + width / 2) / window.innerWidth;
        confetti({
          origin: { x, y },
          angle: 45,
          spread: 120,
          ...options
        });
      }
    }
  ];
}
