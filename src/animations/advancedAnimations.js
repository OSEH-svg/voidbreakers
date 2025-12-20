import gsap from "gsap";

// CACHE DOM QUERIES
const gemCache = new Map();

const getGemElement = (index) => {
  if (!gemCache.has(index)) {
    const element = document.querySelector(`[data-index="${index}"]`);
    if (element) gemCache.set(index, element);
  }
  return gemCache.get(index);
};

// Clear cache when board resets
export const clearGemCache = () => {
  gemCache.clear();
};

// OBJECT POOL FOR PARTICLES (reuse instead of create/destroy)
const particlePool = [];
const MAX_POOL_SIZE = 50;

const getParticle = () => {
  if (particlePool.length > 0) {
    return particlePool.pop();
  }

  const particle = document.createElement("div");
  particle.className = "special-trail-particle";
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

/**
 * Animates gems falling down into blank spaces
 * OPTIMIZED: Cache elements, batch animations
 */
export const animateGemDrop = (movedIndexes, width) => {
  return new Promise((resolve) => {
    if (movedIndexes.length === 0) {
      resolve();
      return;
    }

    // Cache all elements first
    const elements = movedIndexes
      .map((index) => getGemElement(index))
      .filter(Boolean);

    if (elements.length === 0) {
      resolve();
      return;
    }

    const tl = gsap.timeline({ onComplete: resolve });

    // Group by column for staggered effect
    const columnGroups = {};
    movedIndexes.forEach((index) => {
      const col = index % width;
      if (!columnGroups[col]) columnGroups[col] = [];
      columnGroups[col].push(index);
    });

    // Animate each column
    Object.keys(columnGroups).forEach((col, colIndex) => {
      const indexes = columnGroups[col];
      const columnElements = indexes
        .map((index) => getGemElement(index))
        .filter(Boolean);

      const delay = colIndex * 0.02;

      // Batch animate all gems in column
      tl.fromTo(
        columnElements,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "bounce.out",
          stagger: 0.05,
        },
        delay
      );
    });
  });
};

/**
 * Animates new gems spawning at the top
 * OPTIMIZED: Batch query, single timeline
 */
export const animateNewGemSpawn = (newGemIndexes, width) => {
  return new Promise((resolve) => {
    if (newGemIndexes.length === 0) {
      resolve();
      return;
    }

    // Batch query all elements
    const elements = newGemIndexes
      .map((index) => getGemElement(index))
      .filter(Boolean);

    if (elements.length === 0) {
      resolve();
      return;
    }

    const tl = gsap.timeline({ onComplete: resolve });

    // Calculate stagger based on column
    const staggers = newGemIndexes.map((_, i) => {
      const col = newGemIndexes[i] % width;
      return col * 0.03;
    });

    tl.fromTo(
      elements,
      {
        scale: 0,
        y: -50,
        rotation: -180,
        opacity: 0,
      },
      {
        scale: 1,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.5)",
        stagger: {
          each: 0.03,
          from: "start",
        },
      }
    );
  });
};

/**
 * Animates board shake effect
 * OPTIMIZED: Cache board element
 */
let boardElement = null;

export const animateBoardShake = (intensity = "light") => {
  return new Promise((resolve) => {
    if (!boardElement) {
      boardElement = document.querySelector(".game-board-container");
    }

    if (!boardElement) {
      resolve();
      return;
    }

    const shakeAmount = intensity === "heavy" ? 10 : 5;
    const repeatCount = intensity === "heavy" ? 8 : 4;

    gsap.to(boardElement, {
      x: `+=${shakeAmount}`,
      duration: 0.05,
      yoyo: true,
      repeat: repeatCount,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.set(boardElement, { x: 0 });
        resolve();
      },
    });
  });
};

/**
 * Press effect when dragging starts
 * OPTIMIZED: Use cached element
 */
export const animateGemPress = (index) => {
  const element = getGemElement(index);
  if (!element) return Promise.resolve();

  return gsap.to(element, {
    scale: 0.9,
    duration: 0.1,
    ease: "power2.in",
  });
};

/**
 * Release effect when drag ends
 * OPTIMIZED: Use cached element
 */
export const animateGemRelease = (index) => {
  const element = getGemElement(index);
  if (!element) return Promise.resolve();

  return gsap.to(element, {
    scale: 1,
    duration: 0.2,
    ease: "elastic.out(1, 0.5)",
  });
};

/**
 * Creates particle trail for special gem activation
 * OPTIMIZED: Fewer particles, object pooling
 */
export const animateSpecialGemTrail = (index, type, width) => {
  return new Promise((resolve) => {
    const element = getGemElement(index);
    if (!element) {
      resolve();
      return;
    }

    const rect = element.getBoundingClientRect(); // Only called once now
    const particleCount = 6; // Reduced from 12
    const particles = [];

    // Create trail particles from pool
    for (let i = 0; i < particleCount; i++) {
      const particle = getParticle();

      // Use CSS class instead of inline styles
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: #FFD700;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        box-shadow: 0 0 15px #FFD700;
      `;
      document.body.appendChild(particle);
      particles.push(particle);
    }

    // Animate all particles at once with stagger
    const targets = particles.map((p, i) => {
      let x = 0,
        y = 0;

      if (type === "horizontal") {
        x = (i % 2 === 0 ? 1 : -1) * (rect.width * 4);
        y = (Math.random() - 0.5) * 20;
      } else {
        y = (i % 2 === 0 ? 1 : -1) * (rect.height * 4);
        x = (Math.random() - 0.5) * 20;
      }

      return { element: p, x, y };
    });

    const tl = gsap.timeline({
      onComplete: () => {
        particles.forEach(returnParticle);
        resolve();
      },
    });

    targets.forEach(({ element, x, y }, i) => {
      tl.to(
        element,
        {
          x,
          y,
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        i * 0.05
      );
    });
  });
};

/**
 * Combined row and column blast when two swords are swapped
 * OPTIMIZED: Simpler effect, fewer DOM elements
 */
export const animateCrossBlast = (index1, index2, width) => {
  return new Promise((resolve) => {
    // Flash effect instead of creating 4 full-screen elements
    const gameBoard = document.querySelector(".game");
    if (!gameBoard) {
      resolve();
      return;
    }

    // Simple flash overlay
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 999;
    `;
    gameBoard.appendChild(flash);

    gsap.fromTo(
      flash,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          flash.remove();
          resolve();
        },
      }
    );
  });
};

/**
 * Pulse effect for special gems (swords)
 * OPTIMIZED: Limited scale change, no filter (expensive)
 */
const activePulses = new Set();

export const animateSpecialGemPulse = (index) => {
  // Prevent duplicate pulses
  if (activePulses.has(index)) return;

  const element = getGemElement(index);
  if (!element) return;

  activePulses.add(index);

  // Simpler pulse - just scale, no filter
  gsap.to(element, {
    scale: 1.08, // Reduced from 1.1
    duration: 0.8,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
    onInterrupt: () => activePulses.delete(index),
  });
};

/**
 * Stops pulse effect
 * OPTIMIZED: Track active pulses
 */
export const stopSpecialGemPulse = (index) => {
  const element = getGemElement(index);
  if (!element) return;

  activePulses.delete(index);
  gsap.killTweensOf(element);
  gsap.to(element, {
    scale: 1,
    duration: 0.2,
  });
};

// Call this when board resets
export const cleanupAnimations = () => {
  clearGemCache();
  activePulses.clear();
  boardElement = null;
};
