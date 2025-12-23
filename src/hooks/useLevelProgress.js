import { useState, useCallback, useEffect } from "react";
import { getLevel, getNextLevel } from "../data/levels";

export const useLevelProgress = (currentLevelId = 1) => {
  const [level, setLevel] = useState(getLevel(currentLevelId));
  const [movesRemaining, setMovesRemaining] = useState(level?.moves || 0);
  const [progress, setProgress] = useState([]); 
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  useEffect(() => {
    if (level) {
      setProgress(new Array(level.objectives.length).fill(0));
      setMovesRemaining(level.moves);
    }
  }, [level]);

  const decrementMoves = useCallback(() => {
    setMovesRemaining((prev) => Math.max(0, prev - 1));
  }, []);

  const updateProgress = useCallback(
    (objectiveIndex, amount) => {
      setProgress((prev) => {
        const newProgress = [...prev];
        newProgress[objectiveIndex] = Math.min(
          newProgress[objectiveIndex] + amount,
          level.objectives[objectiveIndex].amount
        );
        return newProgress;
      });
    },
    [level]
  );

  const trackCollectedGem = useCallback(
    (gemColorName, gemModifier) => {
      if (!level) return;

      level.objectives.forEach((objective, index) => {
        if (
          objective.targetType === "color" &&
          objective.targetColor === gemColorName
        ) {
          updateProgress(index, 1);
        }

        let modifierToCheck = gemModifier;
        if (
          gemModifier === "vertical-sword" ||
          gemModifier === "horizontal-sword"
        ) {
          modifierToCheck = "sword";
        }
        if (
          objective.targetType === "modifier" &&
          objective.targetModifier === modifierToCheck
        ) {
          updateProgress(index, 1);
        }
      });
    },
    [level, updateProgress]
  );

  const updateScoreProgress = useCallback(
    (currentScore) => {
      if (!level) return;

      level.objectives.forEach((objective, index) => {
        if (objective.type === "score") {
          setProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = Math.min(currentScore, objective.amount);
            return newProgress;
          });
        }
      });
    },
    [level]
  );

  const checkObjectivesComplete = useCallback(() => {
    if (!level) return false;

    return level.objectives.every((objective, index) => {
      return progress[index] >= objective.amount;
    });
  }, [level, progress]);

  useEffect(() => {
    if (isLevelComplete) return; 

    if (movesRemaining === 0) {
      const objectivesComplete = checkObjectivesComplete();

      if (objectivesComplete) {
        // Victory!
        setIsVictory(true);
        setShowResultModal(true);
        setIsLevelComplete(true);
      } else {
        // Defeat!
        setIsVictory(false);
        setShowResultModal(true);
        setIsLevelComplete(true);
      }
    }

    if (movesRemaining > 0 && checkObjectivesComplete()) {
      setIsVictory(true);
      setShowResultModal(true);
      setIsLevelComplete(true);
    }
  }, [movesRemaining, checkObjectivesComplete, isLevelComplete]);

  const loadNextLevel = useCallback(() => {
    const nextLevel = getNextLevel(level.id);
    if (nextLevel) {
      setLevel(nextLevel);
      setMovesRemaining(nextLevel.moves);
      setProgress(new Array(nextLevel.objectives.length).fill(0));
      setIsLevelComplete(false);
      setShowResultModal(false);
      setIsVictory(false);
    }
  }, [level]);

  const retryLevel = useCallback(() => {
    if (level) {
      setMovesRemaining(level.moves);
      setProgress(new Array(level.objectives.length).fill(0));
      setIsLevelComplete(false);
      setShowResultModal(false);
      setIsVictory(false);
    }
  }, [level]);

  const hasNextLevel = useCallback(() => {
    return getNextLevel(level?.id) !== null;
  }, [level]);

  return {
    // Level data
    level,
    movesRemaining,
    progress,

    // Modal state
    showResultModal,
    isVictory,

    // Actions
    decrementMoves,
    trackCollectedGem,
    updateScoreProgress,
    loadNextLevel,
    retryLevel,
    hasNextLevel: hasNextLevel(),
  };
};
