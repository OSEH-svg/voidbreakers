
import gsap from "gsap";

/**
 * @param {number} totalTiles
 * @param {number} width
 */

export const animateTileFill = (totalTiles, width) => {
  const tl = gsap.timeline();

  for (let i = 0; i < totalTiles; i++) {
    const col = i % width;
    const row = Math.floor(i / width);
    

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
        ease: "back.out(1.7)", 
      },
      delay
    );
  }

  return tl;
};
