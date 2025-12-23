import { useState, useRef, useCallback } from "react";
import { WIDTH, gemColors, gemNames } from "../utils/gameConstants";

export const useGameState = () => {
  const [gems, setGems] = useState([]);
  const currentGems = useRef([]);
  const [score, setScore] = useState(0);
  const [selectedGem, setSelectedGem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateScore = useCallback((num) => {
    setScore((prevScore) => prevScore + num);
  }, []);

  const playSound = useCallback((id) => {
    console.log(`Play sound: ${id}`);
  }, []);

  const createBoard = useCallback(() => {
    const randomGems = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const randomIndex = Math.floor(Math.random() * gemColors.length);
      const randomColor = gemColors[randomIndex];
      const randomColorName = gemNames[randomIndex];
      randomGems.push({
        color: randomColor,
        colorName: randomColorName,
        modifier: "",
      });
    }
    setGems(randomGems);
    currentGems.current = randomGems;
  }, []);

  const syncGems = useCallback(() => {
    setGems([...currentGems.current]);
  }, []);

  return {
    // State
    gems,
    currentGems,
    score,
    selectedGem,
    isProcessing,

    // Setters
    setGems,
    setSelectedGem,
    setIsProcessing,

    // Methods
    updateScore,
    playSound,
    createBoard,
    syncGems,
  };
};
