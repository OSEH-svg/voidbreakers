import gsap from "gsap";

const tileCache = new Map();

const getTileElement = (index) => {
  if (!tileCache.has(index)) {
    const element = document.querySelector(`[data-index="${index}"]`);
    if (element) tileCache.set(index, element);
  }
  return tileCache.get(index);
};

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


export const animateTileSwap = (draggedIndex, replacedIndex, width) => {
  return new Promise((resolve) => {
    const draggedElement = getTileElement(draggedIndex);
    const replacedElement = getTileElement(replacedIndex);

    if (!draggedElement || !replacedElement) {
      resolve();
      return;
    }

    const draggedCol = draggedIndex % width;
    const draggedRow = Math.floor(draggedIndex / width);
    const replacedCol = replacedIndex % width;
    const replacedRow = Math.floor(replacedIndex / width);

    const size = getTileSize();
    
    const deltaX = (replacedCol - draggedCol) * size;
    const deltaY = (replacedRow - draggedRow) * size;

    const tl = gsap.timeline({ onComplete: resolve });

    tl.to(
      draggedElement,
      {
        x: deltaX,
        y: deltaY,
        duration: 0.25, 
        ease: "back.out(1.2)", 
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

export const animateTileSwapBack = (draggedIndex, replacedIndex) => {
  return new Promise((resolve) => {
    const draggedElement = getTileElement(draggedIndex);
    const replacedElement = getTileElement(replacedIndex);

    if (!draggedElement || !replacedElement) {
      resolve();
      return;
    }

    const tl = gsap.timeline({ onComplete: resolve });

    tl.to([draggedElement, replacedElement], {
      x: "+=4",
      duration: 0.04,
      yoyo: true,
      repeat: 2, 
      ease: "power1.inOut",
    }).to(
      [draggedElement, replacedElement],
      {
        x: 0,
        y: 0,
        duration: 0.2, 
        ease: "power2.out",
        zIndex: 1,
      },
      "+=0.05"
    );
  });
};


export const resetTilePosition = (index) => {
  const element = getTileElement(index);
  if (element) {
    gsap.set(element, {
      x: 0,
      y: 0,
      zIndex: 1,
      clearProps: "transform", 
    });
  }
};

export const resetAllTilePositions = (totalTiles) => {
  const elements = [];
  for (let i = 0; i < totalTiles; i++) {
    const element = getTileElement(i);
    if (element) elements.push(element);
  }

  if (elements.length > 0) {
    gsap.set(elements, {
      x: 0,
      y: 0,
      zIndex: 1,
      clearProps: "transform",
    });
  }
};

export const clearTileCache = () => {
  tileCache.clear();
  tileSize = null;
};