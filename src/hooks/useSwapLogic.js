import { useCallback } from "react";
import { WIDTH } from "../utils/gameConstants";
import { animateCrossBlast } from "../utils/gameAnimations";

export const useSwapLogic = ({
  currentGems,
  selectedGem,
  isProcessing,
  setSelectedGem,
  setIsProcessing,
  syncGems,
  playSound,
  setRowToBlank,
  setColToBlank,
  checkForColumnFour,
  checkForRowFour,
  checkForThree,
  processMatches,
  decrementMoves,
}) => {
  const swapGems = useCallback(
    async (index1, index2) => {
      if (isProcessing) return;
      setIsProcessing(true);

      decrementMoves();

      const gem1 = currentGems.current[index1];
      const gem2 = currentGems.current[index2];

      const isSword1 =
        gem1.modifier === "vertical-sword" ||
        gem1.modifier === "horizontal-sword";
      const isSword2 =
        gem2.modifier === "vertical-sword" ||
        gem2.modifier === "horizontal-sword";

      // SWORD + SWORD = CROSS BLAST
      if (isSword1 && isSword2) {
        await animateCrossBlast(index1);
        await setRowToBlank(index1);
        await setColToBlank(index1);
        setSelectedGem(null);
        syncGems();
        playSound("correctMove");
        await processMatches();
        return;
      }

      // SWORD + ANY GEM = ACTIVATE
      if (isSword1) {
        if (gem1.modifier === "vertical-sword") {
          await setColToBlank(index1);
        } else {
          await setRowToBlank(index1);
        }
        setSelectedGem(null);
        syncGems();
        playSound("correctMove");
        await processMatches();
        return;
      }

      if (isSword2) {
        if (gem2.modifier === "vertical-sword") {
          await setColToBlank(index2);
        } else {
          await setRowToBlank(index2);
        }
        setSelectedGem(null);
        syncGems();
        playSound("correctMove");
        await processMatches();
        return;
      }

      // REGULAR SWAP
      const tempColor = gem1.color;
      const tempColorName = gem1.colorName;
      const tempModifier = gem1.modifier;

      currentGems.current[index1].color = gem2.color;
      currentGems.current[index1].colorName = gem2.colorName;
      currentGems.current[index1].modifier = gem2.modifier;
      currentGems.current[index2].color = tempColor;
      currentGems.current[index2].colorName = tempColorName;
      currentGems.current[index2].modifier = tempModifier;

      syncGems();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const foundFourColumn = await checkForColumnFour([index1, index2]);
      const foundFourRow =
        !foundFourColumn && (await checkForRowFour([index1, index2]));
      const foundThree =
        !(foundFourColumn || foundFourRow) && (await checkForThree());

      if (foundFourColumn || foundFourRow || foundThree) {
        playSound("correctMove");
        setSelectedGem(null);
        syncGems();
        await processMatches();
      } else {
        // Invalid swap - revert
        currentGems.current[index2].color = gem1.color;
        currentGems.current[index2].colorName = gem1.colorName;
        currentGems.current[index2].modifier = gem1.modifier;
        currentGems.current[index1].color = tempColor;
        currentGems.current[index1].colorName = tempColorName;
        currentGems.current[index1].modifier = tempModifier;

        syncGems();
        playSound("wrongMove");
        setIsProcessing(false);
      }
    },
    [
      isProcessing,
      currentGems,
      setIsProcessing,
      setSelectedGem,
      syncGems,
      playSound,
      setRowToBlank,
      setColToBlank,
      checkForColumnFour,
      checkForRowFour,
      checkForThree,
      processMatches,
      decrementMoves,
    ]
  );

  const handleGemClick = useCallback(
    (index) => {
      if (isProcessing) return;

      if (selectedGem === null) {
        setSelectedGem(index);
        playSound("gemSelect");
      } else if (selectedGem === index) {
        setSelectedGem(null);
      } else {
        const validMoves = [
          selectedGem - 1,
          selectedGem - WIDTH,
          selectedGem + 1,
          selectedGem + WIDTH,
        ];

        if (validMoves.includes(index)) {
          swapGems(selectedGem, index);
        } else {
          setSelectedGem(index);
          playSound("gemSelect");
        }
      }
    },
    [selectedGem, isProcessing, swapGems, setSelectedGem, playSound]
  );

  return {
    swapGems,
    handleGemClick,
  };
};
