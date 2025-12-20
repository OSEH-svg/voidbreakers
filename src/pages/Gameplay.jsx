import { useEffect, useState, useRef, useCallback } from "react";

import bgImage from "../assets/images/gameBg.png";
import boardFrame from "../assets/images/boardFrame.svg";
import blank from "../assets/icons/blank.png";
import sword from "../assets/icons/sword.svg";

import blueGem from "../assets/gameGems/blueGem.svg";
import greenGem from "../assets/gameGems/greenGem.svg";
import orangeGem from "../assets/gameGems/orangeGem.svg";
import purpleGem from "../assets/gameGems/purpleGem.svg";
import redGem from "../assets/gameGems/redGem.svg";
import yellowGem from "../assets/gameGems/yellowGem.svg";

import { animateTileFill } from "../animations/tileFillAnimation";
import {
  animateTileSwap,
  animateTileSwapBack,
  resetAllTilePositions,
  clearTileCache,
} from "../animations/tileSwapAnimation";
import {
  animateMatchBlast,
  animateSpecialGemCreation,
  animateRowBlastEffect,
  animateColumnBlastEffect,
  cleanupMatchAnimations,
} from "../animations/matchBlastAnimation";
import {
  animateGemDrop,
  animateNewGemSpawn,
  animateBoardShake,
  animateGemPress,
  animateCrossBlast,
  animateSpecialGemPulse,
  cleanupAnimations,
  clearGemCache,
} from "../animations/advancedAnimations";

import FPSCounter from "../components/FPSCounter";

const WIDTH = 8;
const gemColors = [blueGem, greenGem, orangeGem, purpleGem, redGem, yellowGem];

const Gameplay = () => {
  const [gems, setGems] = useState([]);
  const currentGems = useRef([]);
  const [score, setScore] = useState(0);
  const [draggedGem, setDraggedGem] = useState(null);
  const [replacedGem, setReplacedGem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateScore = useCallback((num) => {
    setScore((prevScore) => prevScore + num);
  }, []);

  const playSound = useCallback((id) => {
    const audio = document.getElementById(id);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.log("Audio play failed:", err));
    }
  }, []);

  const setColToBlank = useCallback(
    async (index) => {
      const col = index % WIDTH;
      const columnIndexes = [];

      for (let i = 0; i < WIDTH; i++) {
        columnIndexes.push(col + i * WIDTH);
      }

      // Animate column blast
      await animateColumnBlastEffect(col, WIDTH);

      // Clear after animation
      columnIndexes.forEach((idx) => {
        currentGems.current[idx].color = blank;
        currentGems.current[idx].modifier = "";
      });

      updateScore(WIDTH);
      playSound("lineBlast");
    },
    [updateScore, playSound]
  );

  const setRowToBlank = useCallback(
    async (index) => {
      const row = Math.floor(index / WIDTH);
      const rowIndexes = [];

      for (let i = row * WIDTH; i < row * WIDTH + WIDTH; i++) {
        rowIndexes.push(i);
      }

      // Animate row blast
      await animateRowBlastEffect(row, WIDTH);

      // Clear after animation
      rowIndexes.forEach((idx) => {
        currentGems.current[idx].color = blank;
        currentGems.current[idx].modifier = "";
      });

      updateScore(WIDTH);
      playSound("lineBlast");
    },
    [updateScore, playSound]
  );

  const getGemImage = useCallback((color, modifier) => {
    if (modifier === "horizontal-match" || modifier === "vertical-match") {
      return sword;
    }
    return color;
  }, []);

  const checkForColumns = useCallback(
    async (num, indexes = null) => {
      for (let i = 0; i < WIDTH * WIDTH - (num - 1) * WIDTH; i++) {
        const columns = [];
        for (let j = 0; j < num; j++) {
          columns.push(i + j * WIDTH);
        }

        const decidedColor = currentGems.current[i].color;
        const isBlank = decidedColor === blank;

        if (isBlank) continue;

        if (
          columns.every(
            (square) => currentGems.current[square].color === decidedColor
          )
        ) {
          updateScore(num);

          let specialGemIndex = -1;
          if (num > 3) {
            specialGemIndex = columns.findIndex((col) =>
              indexes?.includes(col)
            );
            if (specialGemIndex === -1) specialGemIndex = 0;
            playSound("matchOfFour");
          }

          const indexesToAnimate = [];

          // Check each gem in the match
          for (let j = 0; j < columns.length; j++) {
            const gemIndex = columns[j];

            // If this gem is already a special gem (sword), trigger its effect
            if (currentGems.current[gemIndex].modifier) {
              if (currentGems.current[gemIndex].modifier === "vertical-match") {
                await setColToBlank(gemIndex);
              } else if (
                currentGems.current[gemIndex].modifier === "horizontal-match"
              ) {
                await setRowToBlank(gemIndex);
              }
            } else if (j === specialGemIndex) {
              // This position will become a special gem
              currentGems.current[gemIndex].modifier = "vertical-match";
            } else {
              // Regular gem to be blasted
              indexesToAnimate.push(gemIndex);
            }
          }

          // Animate the blast for regular gems
          if (indexesToAnimate.length > 0) {
            await animateMatchBlast(
              indexesToAnimate,
              currentGems.current,
              WIDTH
            );

            // Clear after animation
            indexesToAnimate.forEach((idx) => {
              currentGems.current[idx].color = blank;
              currentGems.current[idx].modifier = "";
            });
          }

          // Animate special gem creation if one was made
          if (specialGemIndex !== -1) {
            await animateSpecialGemCreation(columns[specialGemIndex]);
            // Add continuous pulse to special gem
            animateSpecialGemPulse(columns[specialGemIndex]);
          }

          return true; // Return immediately after first match
        }
      }

      return false;
    },
    [updateScore, playSound, setColToBlank, setRowToBlank]
  );

  const checkForRows = useCallback(
    async (num, indexes = null) => {
      for (let i = 0; i < WIDTH * WIDTH; i++) {
        const rows = [];
        for (let j = 0; j < num; j++) {
          rows.push(i + j);
        }

        const decidedColor = currentGems.current[i].color;
        const isBlank = decidedColor === blank;

        if (WIDTH - (i % WIDTH) < num || isBlank) continue;

        if (
          rows.every(
            (square) => currentGems.current[square].color === decidedColor
          )
        ) {
          updateScore(num);

          let specialGemIndex = -1;
          if (num > 3) {
            specialGemIndex = rows.findIndex((row) => indexes?.includes(row));
            if (specialGemIndex === -1) specialGemIndex = 0;
            playSound("matchOfFour");
          }

          const indexesToAnimate = [];

          for (let j = 0; j < rows.length; j++) {
            const gemIndex = rows[j];

            if (currentGems.current[gemIndex].modifier) {
              if (currentGems.current[gemIndex].modifier === "vertical-match") {
                await setColToBlank(gemIndex);
              } else if (
                currentGems.current[gemIndex].modifier === "horizontal-match"
              ) {
                await setRowToBlank(gemIndex);
              }
            } else if (j === specialGemIndex) {
              currentGems.current[gemIndex].modifier = "horizontal-match";
            } else {
              indexesToAnimate.push(gemIndex);
            }
          }

          if (indexesToAnimate.length > 0) {
            await animateMatchBlast(
              indexesToAnimate,
              currentGems.current,
              WIDTH
            );

            indexesToAnimate.forEach((idx) => {
              currentGems.current[idx].color = blank;
              currentGems.current[idx].modifier = "";
            });
          }

          if (specialGemIndex !== -1) {
            await animateSpecialGemCreation(rows[specialGemIndex]);
            animateSpecialGemPulse(rows[specialGemIndex]);
          }

          return true;
        }
      }

      return false;
    },
    [updateScore, playSound, setColToBlank, setRowToBlank]
  );

  const moveIntoGemBelow = useCallback(() => {
    let moved = false;
    const movedIndexes = [];
    const newGemIndexes = [];

    for (let i = WIDTH * WIDTH - 1; i >= 0; i--) {
      const isFirstRow = i < WIDTH;

      if (isFirstRow && currentGems.current[i].color === blank) {
        const randomColor =
          gemColors[Math.floor(Math.random() * gemColors.length)];
        currentGems.current[i].color = randomColor;
        moved = true;
        newGemIndexes.push(i);
      }

      if (
        i < WIDTH * WIDTH - WIDTH &&
        currentGems.current[i + WIDTH].color === blank
      ) {
        currentGems.current[i + WIDTH].color = currentGems.current[i].color;
        currentGems.current[i + WIDTH].modifier =
          currentGems.current[i].modifier;
        currentGems.current[i].color = blank;
        currentGems.current[i].modifier = "";
        moved = true;
        movedIndexes.push(i + WIDTH);
      }
    }

    return { moved, movedIndexes, newGemIndexes };
  }, []);

  const processMatches = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    let hasChanges = true;
    let updateNeeded = false;

    while (hasChanges) {
      hasChanges = false;

      // Check all match types WITHOUT updating state between each
      const foundColumn4 = await checkForColumns(4);
      const foundRow4 = !foundColumn4 && (await checkForRows(4));
      const foundColumn3 =
        !(foundColumn4 || foundRow4) && (await checkForColumns(3));
      const foundRow3 =
        !(foundColumn4 || foundRow4 || foundColumn3) && (await checkForRows(3));

      if (foundColumn4 || foundRow4 || foundColumn3 || foundRow3) {
        hasChanges = true;
        updateNeeded = true;
        // Single state update after all checks
        setGems([...currentGems.current]);
        await new Promise((resolve) => setTimeout(resolve, 250)); // Slightly faster
        continue;
      }

      // Move gems down
      const { moved, movedIndexes, newGemIndexes } = moveIntoGemBelow();
      if (moved) {
        hasChanges = true;
        updateNeeded = true;
        setGems([...currentGems.current]);

        // Animate drops and new spawns
        await animateGemDrop(movedIndexes, WIDTH);
        await animateNewGemSpawn(newGemIndexes, WIDTH);
        await new Promise((resolve) => setTimeout(resolve, 150)); // Slightly faster
      }
    }

    // Only reset positions if something actually changed
    if (updateNeeded) {
      resetAllTilePositions(WIDTH * WIDTH);
    }

    setIsProcessing(false);
  }, [isProcessing, checkForColumns, checkForRows, moveIntoGemBelow]);

  const dragStart = useCallback(
    (e) => {
      if (isProcessing) {
        e.preventDefault();
        return;
      }
      setDraggedGem(e.target);

      const index = parseInt(e.target.getAttribute("data-index"));
      animateGemPress(index);
    },
    [isProcessing]
  );

  const dragDrop = useCallback((e) => {
    setReplacedGem(e.target);
  }, []);

  const dragEnd = useCallback(
    async (e) => {
      if (isProcessing || !draggedGem || !replacedGem) return;

      const draggedGemIndex = parseInt(draggedGem.getAttribute("data-index"));
      const replacedGemIndex = parseInt(replacedGem.getAttribute("data-index"));

      const validMoves = [
        draggedGemIndex - 1,
        draggedGemIndex - WIDTH,
        draggedGemIndex + 1,
        draggedGemIndex + WIDTH,
      ];

      const validMove = validMoves.includes(replacedGemIndex);

      if (!validMove) {
        setDraggedGem(null);
        setReplacedGem(null);
        return;
      }

      setIsProcessing(true);

      // Animate the swap
      await animateTileSwap(draggedGemIndex, replacedGemIndex, WIDTH);

      const draggedIsSpecial = currentGems.current[draggedGemIndex].modifier;
      const replacedIsSpecial = currentGems.current[replacedGemIndex].modifier;

      // Two swords combined - MEGA BLAST!
      if (draggedIsSpecial && replacedIsSpecial) {
        await animateCrossBlast(draggedGemIndex, replacedGemIndex, WIDTH);
        await animateBoardShake("heavy");

        await setRowToBlank(replacedGemIndex);
        await setColToBlank(draggedGemIndex);
        playSound("correctMove");

        setDraggedGem(null);
        setReplacedGem(null);
        setGems([...currentGems.current]);
        await processMatches();
        return;
      }

      // Regular swap - check for matches
      const tempColor = currentGems.current[draggedGemIndex].color;
      const tempModifier = currentGems.current[draggedGemIndex].modifier;

      currentGems.current[draggedGemIndex].color =
        currentGems.current[replacedGemIndex].color;
      currentGems.current[draggedGemIndex].modifier =
        currentGems.current[replacedGemIndex].modifier;

      currentGems.current[replacedGemIndex].color = tempColor;
      currentGems.current[replacedGemIndex].modifier = tempModifier;

      const isAColumnOfFour = await checkForColumns(4, [
        draggedGemIndex,
        replacedGemIndex,
      ]);
      const isARowOfFour = isAColumnOfFour
        ? false
        : await checkForRows(4, [draggedGemIndex, replacedGemIndex]);
      const isAColumnOfThree =
        isAColumnOfFour || isARowOfFour ? false : await checkForColumns(3);
      const isARowOfThree =
        isAColumnOfFour || isARowOfFour || isAColumnOfThree
          ? false
          : await checkForRows(3);

      if (
        isAColumnOfFour ||
        isARowOfFour ||
        isAColumnOfThree ||
        isARowOfThree
      ) {
        playSound("correctMove");
        setDraggedGem(null);
        setReplacedGem(null);
        setGems([...currentGems.current]);
        await processMatches();
      } else {
        // Invalid move - swap back
        currentGems.current[replacedGemIndex].color =
          currentGems.current[draggedGemIndex].color;
        currentGems.current[replacedGemIndex].modifier =
          currentGems.current[draggedGemIndex].modifier;

        currentGems.current[draggedGemIndex].color = tempColor;
        currentGems.current[draggedGemIndex].modifier = tempModifier;

        await animateTileSwapBack(draggedGemIndex, replacedGemIndex);
        await animateBoardShake("light");

        setGems([...currentGems.current]);
        playSound("wrongMove");
        setDraggedGem(null);
        setReplacedGem(null);
        setIsProcessing(false);
      }
    },
    [
      isProcessing,
      draggedGem,
      replacedGem,
      checkForColumns,
      checkForRows,
      processMatches,
      playSound,
      setRowToBlank,
      setColToBlank,
    ]
  );

  const createBoard = useCallback(() => {
    // Clean up all animation caches
    cleanupAnimations();
    clearGemCache();
    cleanupMatchAnimations();
    clearTileCache();

    const randomGems = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const randomColor =
        gemColors[Math.floor(Math.random() * gemColors.length)];
      randomGems.push({ color: randomColor, modifier: "" });
    }
    setGems(randomGems);
    currentGems.current = randomGems;

    setTimeout(() => {
      animateTileFill(WIDTH * WIDTH, WIDTH);
    }, 50);
  }, []);

  useEffect(() => {
    createBoard();

    // Cleanup on unmount
    return () => {
      cleanupAnimations();
      clearGemCache();
      cleanupMatchAnimations();
      clearTileCache();
    };
  }, [createBoard]);

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center game"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <FPSCounter />
      <div className="text-2xl px-6 py-3 mb-4 bg-purple-700 text-white rounded-md border-2 border-white pointer-events-none">
        <span>Score: </span> <b>{score}</b>
      </div>

      <div className="game-board-container">
        <div className="relative w-[90vw] max-w-[560px] aspect-square">
          <img
            src={boardFrame}
            alt="Board Frame"
            className="absolute inset-0 w-full h-full z-20 pointer-events-none select-none"
          />

          <div className="absolute inset-[8%] flex flex-wrap z-10">
            {gems.map(({ color, modifier }, index) => (
              <div
                key={index}
                className="flex items-center justify-center border border-white/5"
                style={{
                  width: "calc(100% / 8)",
                  height: "calc(100% / 8)",
                }}
                data-index={index}
                data-src={color}
                data-modifier={modifier}
                draggable={!isProcessing}
                onDragStart={dragStart}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={dragDrop}
                onDragEnd={dragEnd}
              >
                <img
                  src={getGemImage(color, modifier)}
                  alt="Gem"
                  className="w-full h-full object-contain p-1 pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gameplay;
