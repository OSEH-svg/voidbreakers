import { WIDTH } from "./gameConstants";


export const animateGemPop = (indexes) => {
  indexes.forEach((index) => {
    const tile = document.querySelector(`[data-index="${index}"]`);
    if (tile) {
      tile.classList.add("gem-popping");
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      indexes.forEach((index) => {
        const tile = document.querySelector(`[data-index="${index}"]`);
        if (tile) {
          tile.classList.remove("gem-popping");
        }
      });
      resolve();
    }, 200);
  });
};


export const animateSwordBlastRow = (rowIndex) => {
  const row = Math.floor(rowIndex / WIDTH);

  const blast = document.createElement("div");
  blast.className = "sword-blast-row";
  blast.style.top = `${(row / WIDTH) * 100}%`;

  const board = document.querySelector(".tile-grid");
  if (board) {
    board.appendChild(blast);

    setTimeout(() => {
      blast.remove();
    }, 400);
  }

  const rowIndexes = [];
  for (let i = row * WIDTH; i < row * WIDTH + WIDTH; i++) {
    rowIndexes.push(i);
    const tile = document.querySelector(`[data-index="${i}"]`);
    if (tile) {
      tile.classList.add("gem-blast-flash");
      setTimeout(() => tile.classList.remove("gem-blast-flash"), 300);
    }
  }

  return new Promise((resolve) => setTimeout(resolve, 350));
};


export const animateSwordBlastColumn = (colIndex) => {
  const col = colIndex % WIDTH;

  const blast = document.createElement("div");
  blast.className = "sword-blast-column";
  blast.style.left = `${(col / WIDTH) * 100}%`;

  const board = document.querySelector(".tile-grid");
  if (board) {
    board.appendChild(blast);

    setTimeout(() => {
      blast.remove();
    }, 400);
  }

  for (let i = 0; i < WIDTH; i++) {
    const index = col + i * WIDTH;
    const tile = document.querySelector(`[data-index="${index}"]`);
    if (tile) {
      tile.classList.add("gem-blast-flash");
      setTimeout(() => tile.classList.remove("gem-blast-flash"), 300);
    }
  }

  return new Promise((resolve) => setTimeout(resolve, 350));
};

export const animateCrossBlast = async (index) => {
  await Promise.all([animateSwordBlastRow(index), animateSwordBlastColumn(index)]);
};