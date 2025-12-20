// src/animations/tileSwapAnimation.js
import gsap from "gsap";

// CACHE DOM QUERIES
const tileCache = new Map();

const getTileElement = (index) => {
  if (!tileCache.has(index)) {
    const element = document.querySelector(`[data-index="${index}"]`);
    if (element) tileCache.set(index, element);
  }
  return tileCache.get(index);
};

// CACHE TILE SIZE (calculate once)
let tileSize = null;

const getTileSize = () => {
  if (!tileSize) {
    const firstTile = getTileElement(0);
    if (firstTile) {
      const rect = firstTile.getBoundingClientRect();
      tileSize = rect.width;
    }
  }
  return tileSize;
};

/**
 * Animates two tiles swapping positions
 * OPTIMIZED: Cached elements, pixel-based movement
 */
export const animateTileSwap = (draggedIndex, replacedIndex, width) => {
  return new Promise((resolve) => {
    // Get cached elements
    const draggedElement = getTileElement(draggedIndex);
    const replacedElement = getTileElement(replacedIndex);

    if (!draggedElement || !replacedElement) {
      resolve();
      return;
    }

    // Calculate grid positions
    const draggedCol = draggedIndex % width;
    const draggedRow = Math.floor(draggedIndex / width);
    const replacedCol = replacedIndex % width;
    const replacedRow = Math.floor(replacedIndex / width);

    // Get tile size (cached)
    const size = getTileSize();
    
    // Calculate distances in pixels (faster than percentage)
    const deltaX = (replacedCol - draggedCol) * size;
    const deltaY = (replacedRow - draggedRow) * size;

    // Create timeline for synchronized animation
    const tl = gsap.timeline({ onComplete: resolve });

    // Animate both tiles simultaneously
    tl.to(
      draggedElement,
      {
        x: deltaX,
        y: deltaY,
        duration: 0.25, // Slightly faster
        ease: "back.out(1.2)", // Less overshoot
        zIndex: 10,
      },
      0
    ).to(
      replacedElement,
      {
        x: -deltaX,
        y: -deltaY,
        duration: 0.25,
        ease: "back.out(1.2)",
      },
      0
    );
  });
};

/**
 * Animates tiles swapping back to original positions (for invalid moves)
 * OPTIMIZED: Cached elements, faster shake
 */
export const animateTileSwapBack = (draggedIndex, replacedIndex) => {
  return new Promise((resolve) => {
    const draggedElement = getTileElement(draggedIndex);
    const replacedElement = getTileElement(replacedIndex);

    if (!draggedElement || !replacedElement) {
      resolve();
      return;
    }

    const tl = gsap.timeline({ onComplete: resolve });

    // Faster shake effect
    tl.to([draggedElement, replacedElement], {
      x: "+=4",
      duration: 0.04,
      yoyo: true,
      repeat: 2, // Reduced from 3
      ease: "power1.inOut",
    }).to(
      [draggedElement, replacedElement],
      {
        x: 0,
        y: 0,
        duration: 0.2, // Faster reset
        ease: "power2.out",
        zIndex: 1,
      },
      "+=0.05"
    );
  });
};

/**
 * Resets tile positions (useful after state update)
 * OPTIMIZED: Cached element
 */
export const resetTilePosition = (index) => {
  const element = getTileElement(index);
  if (element) {
    gsap.set(element, {
      x: 0,
      y: 0,
      zIndex: 1,
      clearProps: "transform", // Also clear transform property
    });
  }
};

/**
 * Resets all tile positions on the board
 * OPTIMIZED: Batch operation, single GSAP call
 */
export const resetAllTilePositions = (totalTiles) => {
  // Collect all elements first (use cache)
  const elements = [];
  for (let i = 0; i < totalTiles; i++) {
    const element = getTileElement(i);
    if (element) elements.push(element);
  }

  // Reset all at once (MUCH faster than loop)
  if (elements.length > 0) {
    gsap.set(elements, {
      x: 0,
      y: 0,
      zIndex: 1,
      clearProps: "transform",
    });
  }
};

/**
 * Clears the tile cache (call when board resets)
 */
export const clearTileCache = () => {
  tileCache.clear();
  tileSize = null;
};