// hooks/useConfetti.ts
import { useCallback } from "react";
import confetti from "canvas-confetti";

export const useConfetti = () => {
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  return { triggerConfetti };
};
