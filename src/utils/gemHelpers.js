import { WIDTH, MAX_CASCADES, gemColors, gemNames } from "./gameConstants";
import blank from "../assets/icons/blank.png";
import {
  animateSwordBlastRow,
  animateSwordBlastColumn,
} from "./gameAnimations";

export const moveIntoGemBelow = (currentGems) => {
  let moved = false;

  for (let i = WIDTH * WIDTH - 1; i >= 0; i--) {
    const isFirstRow = i < WIDTH;

    if (isFirstRow && currentGems.current[i].color === blank) {
      const randomIndex = Math.floor(Math.random() * gemColors.length);
      const randomColor = gemColors[randomIndex];
      const randomColorName = gemNames[randomIndex];
      currentGems.current[i].color = randomColor;
      currentGems.current[i].colorName = randomColorName;
      currentGems.current[i].modifier = "";
      moved = true;
    }

    if (
      i < WIDTH * WIDTH - WIDTH &&
      currentGems.current[i + WIDTH].color === blank
    ) {
      currentGems.current[i + WIDTH].color = currentGems.current[i].color;
      currentGems.current[i + WIDTH].colorName =
        currentGems.current[i].colorName;
      currentGems.current[i + WIDTH].modifier = currentGems.current[i].modifier;
      currentGems.current[i].color = blank;
      currentGems.current[i].colorName = "";
      currentGems.current[i].modifier = "";
      moved = true;
    }
  }

  return moved;
};

export const processMatches = async ({
  isProcessing,
  setIsProcessing,
  currentGems,
  syncGems,
  checkForColumnFour,
  checkForRowFour,
  checkForThree,
}) => {
  if (isProcessing) return;
  setIsProcessing(true);

  let hasChanges = true;
  let cascadeCount = 0;

  while (hasChanges && cascadeCount < MAX_CASCADES) {
    hasChanges = false;
    cascadeCount++;

    const foundFourColumn = await checkForColumnFour();
    const foundFourRow = !foundFourColumn && (await checkForRowFour());
    const foundThree =
      !(foundFourColumn || foundFourRow) && (await checkForThree());

    if (foundFourColumn || foundFourRow || foundThree) {
      hasChanges = true;
      syncGems();
      await new Promise((resolve) =>
        requestAnimationFrame(() => {
          setTimeout(resolve, 50);
        })
      );
    }

    const moved = moveIntoGemBelow(currentGems);
    if (moved) {
      hasChanges = true;
      syncGems();
      await new Promise((resolve) =>
        requestAnimationFrame(() => {
          setTimeout(resolve, 50);
        })
      );
    }
  }

  syncGems();
  setIsProcessing(false);
};

export const setColToBlank = async (
  index,
  currentGems,
  updateScore,
  playSound
) => {
  const col = index % WIDTH;
  const indexes = [];
  for (let i = 0; i < WIDTH; i++) {
    indexes.push(col + i * WIDTH);
  }

  await animateSwordBlastColumn(index);

  indexes.forEach((idx) => {
    currentGems.current[idx].color = blank;
    currentGems.current[idx].modifier = "";
  });

  updateScore(WIDTH);
  playSound("lineBlast");
};

export const setRowToBlank = async (
  index,
  currentGems,
  updateScore,
  playSound
) => {
  const row = Math.floor(index / WIDTH);
  const indexes = [];
  for (let i = row * WIDTH; i < row * WIDTH + WIDTH; i++) {
    indexes.push(i);
  }

  await animateSwordBlastRow(index);

  indexes.forEach((idx) => {
    currentGems.current[idx].color = blank;
    currentGems.current[idx].modifier = "";
  });

  updateScore(WIDTH);
  playSound("lineBlast");
};
