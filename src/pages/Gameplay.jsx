import { useEffect, useCallback } from "react";
import bgImage from "../assets/images/gameBg.png";
import RotatePrompt from "../components/RotatePrompt";

import GameBoard from "../components/game/GameBoard";
import LevelResultModal from "../components/game/LevelResultModal";

import { useGameState } from "../hooks/useGameState";
import { useMatchDetection } from "../hooks/useMatchDetection";
import { useSwapLogic } from "../hooks/useSwapLogic";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { useLevelProgress } from "../hooks/useLevelProgress";

import {
  processMatches,
  setRowToBlank,
  setColToBlank,
} from "../utils/gemHelpers";

const Gameplay = () => {
  // Core game state
  const {
    gems,
    currentGems,
    score,
    selectedGem,
    isProcessing,
    setSelectedGem,
    setIsProcessing,
    updateScore,
    playSound,
    createBoard,
    syncGems,
  } = useGameState();

  // Level progress hook
  const {
    level,
    movesRemaining,
    progress,
    showResultModal,
    isVictory,
    decrementMoves,
    trackCollectedGem,
    updateScoreProgress,
    loadNextLevel,
    retryLevel,
    hasNextLevel,
  } = useLevelProgress(1);

  // Wrapped helper functions
  const wrappedSetRowToBlank = useCallback(
    async (index) => {
      await setRowToBlank(index, currentGems, updateScore, playSound);
    },
    [currentGems, updateScore, playSound]
  );

  const wrappedSetColToBlank = useCallback(
    async (index) => {
      await setColToBlank(index, currentGems, updateScore, playSound);
    },
    [currentGems, updateScore, playSound]
  );

  // Match detection logic
  const { checkForColumnFour, checkForRowFour, checkForThree } =
    useMatchDetection({
      currentGems,
      updateScore,
      playSound,
      setColToBlank: wrappedSetColToBlank,
      setRowToBlank: wrappedSetRowToBlank,
      trackCollectedGem,
    });

  // Process matches wrapper
  const wrappedProcessMatches = useCallback(async () => {
    await processMatches({
      isProcessing,
      setIsProcessing,
      currentGems,
      syncGems,
      checkForColumnFour,
      checkForRowFour,
      checkForThree,
      onCollectGem: (gem) => trackCollectedGem(gem.color, gem.modifier),
    });
  }, [
    isProcessing,
    setIsProcessing,
    currentGems,
    syncGems,
    checkForColumnFour,
    checkForRowFour,
    checkForThree,
    trackCollectedGem,
  ]);

  // Swap and click logic
  const { swapGems, handleGemClick } = useSwapLogic({
    currentGems,
    selectedGem,
    isProcessing,
    setSelectedGem,
    setIsProcessing,
    syncGems,
    playSound,
    setRowToBlank: wrappedSetRowToBlank,
    setColToBlank: wrappedSetColToBlank,
    checkForColumnFour,
    checkForRowFour,
    checkForThree,
    processMatches: wrappedProcessMatches,
    decrementMoves,
  });

  // Keyboard controls
  useKeyboardControls({
    selectedGem,
    isProcessing,
    setSelectedGem,
    swapGems,
  });

  // Initialize board on mount
  useEffect(() => {
    createBoard();
  }, [createBoard]);

  // Update score progress whenever score changes
  useEffect(() => {
    updateScoreProgress(score);
  }, [score, updateScoreProgress]);

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <RotatePrompt />

      <GameBoard
        level={level}
        gems={gems}
        score={score}
        selectedGem={selectedGem}
        isProcessing={isProcessing}
        onGemClick={handleGemClick}
        movesRemaining={movesRemaining}
        progress={progress}
      />

      <LevelResultModal
        isOpen={showResultModal}
        isVictory={isVictory}
        score={score}
        level={level}
        hasNextLevel={hasNextLevel}
        onNextLevel={loadNextLevel}
        onRetry={retryLevel}
      />
    </div>
  );
};

export default Gameplay;
