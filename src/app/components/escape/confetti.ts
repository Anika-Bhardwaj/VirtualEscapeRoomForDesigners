import confetti from "canvas-confetti";

/* A restrained, premium burst — gold + paper tones, not a party cannon. */
export function celebrate() {
  const colors = ["#d9b26a", "#efe7d6", "#b5372e", "#e3d8c2"];
  confetti({ particleCount: 55, spread: 60, startVelocity: 38, origin: { y: 0.6 }, colors, scalar: 0.9 });
  setTimeout(
    () => confetti({ particleCount: 30, angle: 60, spread: 55, origin: { x: 0 }, colors, scalar: 0.8 }),
    120,
  );
  setTimeout(
    () => confetti({ particleCount: 30, angle: 120, spread: 55, origin: { x: 1 }, colors, scalar: 0.8 }),
    180,
  );
}
