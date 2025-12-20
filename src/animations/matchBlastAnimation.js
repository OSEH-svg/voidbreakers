// src/animations/matchBlastAnimation.js
import gsap from "gsap";

// CACHE DOM QUERIES
const gemCache = new Map();
let gameBoard = null;
let boardRect = null;

const getGemElement = (index) => {
  if (!gemCache.has(index)) {
    const element = document.querySelector(`[data-index="${index}"]`);
    if (element) gemCache.set(index, element);
  }
  return gemCache.get(index);
};

const getGameBoard = () => {
  if (!gameBoard) {
    gameBoard = document.querySelector(".game");
    if (gameBoard) {
      boardRect = gameBoard.getBoundingClientRect();
    }
  }
  return gameBoard;
};

// PARTICLE POOL (reuse particles)
const particlePool = [];
const MAX_POOL_SIZE = 100;

const getParticle = () => {
  if (particlePool.length > 0) {
    return particlePool.pop();
  }
  const particle = document.createElement("div");
  particle.className = "gem-particle";
  return particle;
};

const returnParticle = (particle) => {
  if (particlePool.length < MAX_POOL_SIZE) {
    gsap.set(particle, { clearProps: "all" });
    particle.remove();
    particlePool.push(particle);
  } else {
    particle.remove();
  }
};

// COLOR MAP (no string searching!)
const colorMap = {
  blueGem: "#2196F3",
  greenGem: "#4CAF50",
  orangeGem: "#FF9800",
  purpleGem: "#9C27B0",
  redGem: "#F44336",
  yellowGem: "#FFEB3B",
};

const getParticleColor = (colorUrl) => {
  // Extract gem name from URL
  for (const [name, color] of Object.entries(colorMap)) {
    if (colorUrl.includes(name)) return color;
  }
  return "#FFD700"; // Default gold
};

/**
 * Creates particle effect for gem explosions
 * OPTIMIZED: Object pooling, cached colors, batch animations
 */
const createParticles = (index, color, width) => {
  const element = getGemElement(index);
  if (!element) return;

  const rect = element.getBoundingClientRect(); // Only called once
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const particleColor = getParticleColor(color);

  // Reduced from 8 to 6 particles
  const particleCount = 6;
  const particles = [];
  const angles = [];

  // Create all particles at once
  for (let i = 0; i < particleCount; i++) {
    const particle = getParticle();
    particle.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: ${particleColor};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      left: ${centerX}px;
      top: ${centerY}px;
      box-shadow: 0 0 8px ${particleColor};
    `;
    document.body.appendChild(particle);
    particles.push(particle);

    // Pre-calculate angles
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 40 + Math.random() * 20; // Reduced distance
    angles.push({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
  }

  // Animate all particles in one timeline
  const tl = gsap.timeline({
    onComplete: () => {
      particles.forEach(returnParticle);
    },
  });

  particles.forEach((particle, i) => {
    tl.to(
      particle,
      {
        x: angles[i].x,
        y: angles[i].y,
        opacity: 0,
        scale: 0,
        duration: 0.5, // Slightly faster
        ease: "power2.out",
      },
      0 // All start at same time
    );
  });
};

/**
 * Animates a single gem being matched/destroyed
 * OPTIMIZED: Cached element, simpler animations
 */
export const animateGemBlast = (index, color, width, isSpecial = false) => {
  return new Promise((resolve) => {
    const element = getGemElement(index);
    if (!element) {
      resolve();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(element, { clearProps: "all" });
        resolve();
      },
    });

    if (isSpecial) {
      // Special gem blast
      tl.to(element, {
        scale: 1.2,
        rotation: 90,
        duration: 0.12,
        ease: "power2.in",
      }).to(element, {
        scale: 0,
        opacity: 0,
        duration: 0.15,
        ease: "power2.out",
        onStart: () => createParticles(index, color, width),
      });
    } else {
      // Normal gem blast
      tl.to(element, {
        scale: 1.15,
        opacity: 0.5,
        duration: 0.1,
        ease: "power1.in",
      }).to(element, {
        scale: 0,
        opacity: 0,
        duration: 0.12,
        ease: "power2.out",
        onStart: () => createParticles(index, color, width),
      });
    }
  });
};

/**
 * Animates multiple gems being matched
 * OPTIMIZED: Batch animations, no setTimeout overhead
 */
export const animateMatchBlast = async (
  indexes,
  gems,
  width,
  specialGemIndex = -1
) => {
  if (indexes.length === 0) return;

  // Cache all elements first
  const elements = indexes
    .map((index) => ({
      index,
      element: getGemElement(index),
      isSpecial: index === specialGemIndex,
    }))
    .filter(({ element }) => element);

  if (elements.length === 0) return;

  // Create master timeline
  const masterTimeline = gsap.timeline();

  elements.forEach(({ index, element, isSpecial }, i) => {
    const stagger = i * 0.03; // Slight stagger

    if (isSpecial) {
      masterTimeline
        .to(
          element,
          {
            scale: 1.2,
            rotation: 90,
            duration: 0.12,
            ease: "power2.in",
            onStart: () => createParticles(index, gems[index].color, width),
          },
          stagger
        )
        .to(
          element,
          {
            scale: 0,
            opacity: 0,
            duration: 0.15,
            ease: "power2.out",
          },
          `>${stagger + 0.12}`
        );
    } else {
      masterTimeline
        .to(
          element,
          {
            scale: 1.15,
            opacity: 0.5,
            duration: 0.1,
            ease: "power1.in",
            onStart: () => createParticles(index, gems[index].color, width),
          },
          stagger
        )
        .to(
          element,
          {
            scale: 0,
            opacity: 0,
            duration: 0.12,
            ease: "power2.out",
          },
          `>${stagger + 0.1}`
        );
    }
  });

  // Wait for all animations to complete
  await masterTimeline.then();

  // Reset all elements
  elements.forEach(({ element }) => {
    gsap.set(element, { clearProps: "all" });
  });
};

/**
 * Animates special gem creation (sword appearing)
 * OPTIMIZED: Simpler effect, no filter (expensive)
 */
export const animateSpecialGemCreation = (index) => {
  return new Promise((resolve) => {
    const element = getGemElement(index);
    if (!element) {
      resolve();
      return;
    }

    gsap.fromTo(
      element,
      {
        scale: 0.3,
        opacity: 0,
        rotation: -90,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(2)",
        onComplete: resolve,
      }
    );
  });
};

/**
 * Animates row blast effect
 * OPTIMIZED: CSS class instead of inline styles, simpler gradient
 */
export const animateRowBlastEffect = (rowIndex, width) => {
  return new Promise((resolve) => {
    const board = getGameBoard();
    if (!board) {
      resolve();
      return;
    }

    const refTile = getGemElement(rowIndex * width);
    if (!refTile) {
      resolve();
      return;
    }

    const rect = refTile.getBoundingClientRect();
    const blastLine = document.createElement("div");

    // Simpler gradient, no box-shadow
    blastLine.style.cssText = `
      position: fixed;
      left: ${boardRect.left}px;
      top: ${rect.top + rect.height / 2 - 2}px;
      width: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, #FFD700, transparent);
      z-index: 1000;
      pointer-events: none;
    `;

    document.body.appendChild(blastLine);

    gsap.to(blastLine, {
      width: boardRect.width,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(blastLine, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            blastLine.remove();
            resolve();
          },
        });
      },
    });
  });
};

/**
 * Animates column blast effect
 * OPTIMIZED: Simpler gradient, no box-shadow
 */
export const animateColumnBlastEffect = (colIndex, width) => {
  return new Promise((resolve) => {
    const board = getGameBoard();
    if (!board) {
      resolve();
      return;
    }

    const refTile = getGemElement(colIndex);
    if (!refTile) {
      resolve();
      return;
    }

    const rect = refTile.getBoundingClientRect();
    const blastLine = document.createElement("div");

    blastLine.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2 - 2}px;
      top: ${boardRect.top}px;
      width: 4px;
      height: 0;
      background: linear-gradient(180deg, transparent, #FFD700, transparent);
      z-index: 1000;
      pointer-events: none;
    `;

    document.body.appendChild(blastLine);

    gsap.to(blastLine, {
      height: boardRect.height,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(blastLine, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            blastLine.remove();
            resolve();
          },
        });
      },
    });
  });
};

// Cleanup function
export const cleanupMatchAnimations = () => {
  gemCache.clear();
  gameBoard = null;
  boardRect = null;

  // Clear particle pool
  particlePool.forEach((p) => p.remove());
  particlePool.length = 0;
};
