
import gsap from "gsap";

/**
 * @param {number} totalTiles
 * @param {number} width
 */

export const animateTileFill = (totalTiles, width) => {
  // Create timeline for sequenced animations
  const tl = gsap.timeline();

  // Animate each tile
  for (let i = 0; i < totalTiles; i++) {
    const col = i % width;
    const row = Math.floor(i / width);
    
    // Calculate delay based on column (cascade from left to right)
    // Add slight row delay for diagonal wave effect
    const delay = col * 0.05 + row * 0.02;

    tl.fromTo(
      `[data-index="${i}"]`,
      {
        scale: 0,
        opacity: 0,
        y: -50,
        rotation: -180,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)", // Bouncy effect
      },
      delay // Offset each tile's start time
    );
  }

  return tl;
};
