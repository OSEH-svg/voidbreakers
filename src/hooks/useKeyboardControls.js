import { useEffect } from "react";
import { WIDTH } from "../utils/gameConstants";


export const useKeyboardControls = ({
  selectedGem,
  isProcessing,
  setSelectedGem,
  swapGems,
}) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isProcessing || selectedGem === null) return;

      const row = Math.floor(selectedGem / WIDTH);
      const col = selectedGem % WIDTH;
      let newIndex = null;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (row > 0) newIndex = selectedGem - WIDTH;
          break;
        case "ArrowDown":
          e.preventDefault();
          if (row < WIDTH - 1) newIndex = selectedGem + WIDTH;
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (col > 0) newIndex = selectedGem - 1;
          break;
        case "ArrowRight":
          e.preventDefault();
          if (col < WIDTH - 1) newIndex = selectedGem + 1;
          break;
        case "Escape":
          e.preventDefault();
          setSelectedGem(null);
          break;
        default:
          return;
      }

      if (newIndex !== null) {
        swapGems(selectedGem, newIndex);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedGem, isProcessing, swapGems, setSelectedGem]);
};