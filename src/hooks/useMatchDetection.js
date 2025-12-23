import { useCallback } from "react";
import { WIDTH } from "../utils/gameConstants";
import blank from "../assets/icons/blank.png";
import { animateGemPop } from "../utils/gameAnimations";


export const useMatchDetection = ({
  currentGems,
  updateScore,
  playSound,
  setColToBlank,
  setRowToBlank,
  trackCollectedGem,
}) => {
  // Check for EXACTLY 4 matches in columns
  const checkForColumnFour = useCallback(
    async (swapIndexes = null) => {
      let foundMatch = false;

      for (let i = 0; i < WIDTH * WIDTH - 3 * WIDTH; i++) {
        const column = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3];
        const decidedColor = currentGems.current[i].color;

        if (decidedColor === blank) continue;

        if (
          column.every((idx) => currentGems.current[idx].color === decidedColor)
        ) {
          foundMatch = true;

          let swordIndex = column[1];
          if (swapIndexes && column.includes(swapIndexes[0])) {
            swordIndex = swapIndexes[0];
          } else if (swapIndexes && column.includes(swapIndexes[1])) {
            swordIndex = swapIndexes[1];
          }

          const indexesToPop = [];

          for (const idx of column) {
            if (currentGems.current[idx].modifier === "vertical-sword") {
              await setColToBlank(idx);
            } else if (
              currentGems.current[idx].modifier === "horizontal-sword"
            ) {
              await setRowToBlank(idx);
            } else {
              indexesToPop.push(idx);
            }
          }

          if (indexesToPop.length > 0) {
            await animateGemPop(indexesToPop);
          }

          column.forEach((idx) => {
            if (idx === swordIndex) {
              currentGems.current[idx].modifier = "vertical-sword";
              trackCollectedGem(
                currentGems.current[idx].colorName,
                "vertical-sword"
              );
            } else if (!currentGems.current[idx].modifier) {
              trackCollectedGem(currentGems.current[idx].colorName, "");
              currentGems.current[idx].color = blank;
              currentGems.current[idx].modifier = "";
            }
          });

          updateScore(4);
          playSound("matchOfFour");
          return true;
        }
      }

      return foundMatch;
    },
    [
      currentGems,
      updateScore,
      playSound,
      setColToBlank,
      setRowToBlank,
      trackCollectedGem,
    ]
  );

  // Check for EXACTLY 4 matches in rows
  const checkForRowFour = useCallback(
    async (swapIndexes = null) => {
      let foundMatch = false;

      for (let i = 0; i < WIDTH * WIDTH; i++) {
        const row = [i, i + 1, i + 2, i + 3];
        const decidedColor = currentGems.current[i].color;

        if (i % WIDTH > WIDTH - 4 || decidedColor === blank) continue;

        if (
          row.every((idx) => currentGems.current[idx].color === decidedColor)
        ) {
          foundMatch = true;

          let swordIndex = row[1];
          if (swapIndexes && row.includes(swapIndexes[0])) {
            swordIndex = swapIndexes[0];
          } else if (swapIndexes && row.includes(swapIndexes[1])) {
            swordIndex = swapIndexes[1];
          }

          const indexesToPop = [];

          for (const idx of row) {
            if (currentGems.current[idx].modifier === "vertical-sword") {
              await setColToBlank(idx);
            } else if (
              currentGems.current[idx].modifier === "horizontal-sword"
            ) {
              await setRowToBlank(idx);
            } else {
              indexesToPop.push(idx);
            }
          }

          if (indexesToPop.length > 0) {
            await animateGemPop(indexesToPop);
          }

          row.forEach((idx) => {
            if (idx === swordIndex) {
              currentGems.current[idx].modifier = "horizontal-sword";
              trackCollectedGem(
                currentGems.current[idx].colorName,
                "horizontal-sword"
              );
            } else if (!currentGems.current[idx].modifier) {
              trackCollectedGem(currentGems.current[idx].colorName, "");
              currentGems.current[idx].color = blank;
              currentGems.current[idx].modifier = "";
            }
          });

          updateScore(4);
          playSound("matchOfFour");
          return true;
        }
      }

      return foundMatch;
    },
    [
      currentGems,
      updateScore,
      playSound,
      setColToBlank,
      setRowToBlank,
      trackCollectedGem,
    ]
  );

  // Check for match of 3
  const checkForThree = useCallback(async () => {
    let foundMatch = false;

    // Check columns
    for (let i = 0; i < WIDTH * WIDTH - 2 * WIDTH; i++) {
      const column = [i, i + WIDTH, i + WIDTH * 2];
      const decidedColor = currentGems.current[i].color;

      if (decidedColor === blank) continue;

      if (
        column.every((idx) => currentGems.current[idx].color === decidedColor)
      ) {
        foundMatch = true;

        const indexesToPop = [];

        for (const idx of column) {
          if (currentGems.current[idx].modifier === "vertical-sword") {
            await setColToBlank(idx);
          } else if (currentGems.current[idx].modifier === "horizontal-sword") {
            await setRowToBlank(idx);
          } else {
            indexesToPop.push(idx);
          }
        }

        if (indexesToPop.length > 0) {
          await animateGemPop(indexesToPop);
        }

        indexesToPop.forEach((idx) => {
          trackCollectedGem(currentGems.current[idx].colorName, "");
          currentGems.current[idx].color = blank;
          currentGems.current[idx].modifier = "";
        });

        updateScore(3);
        return true;
      }
    }

    // Check rows
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const row = [i, i + 1, i + 2];
      const decidedColor = currentGems.current[i].color;

      if (i % WIDTH > WIDTH - 3 || decidedColor === blank) continue;

      if (row.every((idx) => currentGems.current[idx].color === decidedColor)) {
        foundMatch = true;

        const indexesToPop = [];

        for (const idx of row) {
          if (currentGems.current[idx].modifier === "vertical-sword") {
            await setColToBlank(idx);
          } else if (currentGems.current[idx].modifier === "horizontal-sword") {
            await setRowToBlank(idx);
          } else {
            indexesToPop.push(idx);
          }
        }

        if (indexesToPop.length > 0) {
          await animateGemPop(indexesToPop);
        }

        indexesToPop.forEach((idx) => {
          trackCollectedGem(currentGems.current[idx].colorName, "");
          currentGems.current[idx].color = blank;
          currentGems.current[idx].modifier = "";
        });

        updateScore(3);
        return true;
      }
    }

    return foundMatch;
  }, [
    currentGems,
    updateScore,
    setColToBlank,
    setRowToBlank,
    trackCollectedGem,
  ]);

  return {
    checkForColumnFour,
    checkForRowFour,
    checkForThree,
  };
};
