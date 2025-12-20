import { useEffect, useState, useRef, useCallback, memo } from "react";

import bgImage from "../assets/images/gameBg.png";
import boardFrame from "../assets/images/boardFrame.svg";
import blank from "../assets/icons/blank.png";
import sword from "../assets/icons/sword.png";

import blueGem from "../assets/gameGems/blueGem.png";
import greenGem from "../assets/gameGems/greenGem.png";
import orangeGem from "../assets/gameGems/orangeGem.png";
import purpleGem from "../assets/gameGems/purpleGem.png";
import redGem from "../assets/gameGems/redGem.png";
import yellowGem from "../assets/gameGems/yellowGem.png";

import { animateTileFill } from "../animations/tileFillAnimation";

const WIDTH = 8;
const gemColors = [blueGem, greenGem, orangeGem, purpleGem, redGem, yellowGem];
const MAX_CASCADES = 50;

// Memoized Gem Component
const GemCell = memo(
  ({ gem, index, isProcessing, isSelected, onClick }) => {
    const isSword =
      gem.modifier === "vertical-sword" || gem.modifier === "horizontal-sword";
    const isHorizontal = gem.modifier === "horizontal-sword";

    return (
      <div
        className={`tile-item gpu-accelerated flex items-center justify-center border transition-all cursor-pointer
        ${
          isSelected
            ? "border-yellow-400 border-4 bg-yellow-400/20 scale-110 shadow-lg shadow-yellow-400/50"
            : "border-white/5 hover:border-white/30 hover:bg-white/5"
        }`}
        style={{
          width: "calc(100% / 8)",
          height: "calc(100% / 8)",
        }}
        data-index={index}
        onClick={() => !isProcessing && onClick(index)}
      >
        <img
          src={isSword ? sword : gem.color}
          alt={isSword ? "Sword" : "Gem"}
          className={`w-full h-full object-contain p-1 pointer-events-none ${
            isSword
              ? isHorizontal
                ? "sword-horizontal"
                : "sword-vertical"
              : ""
          }`}
          loading="eager"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.gem.color === nextProps.gem.color &&
      prevProps.gem.modifier === nextProps.gem.modifier &&
      prevProps.isProcessing === nextProps.isProcessing &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);

GemCell.displayName = "GemCell";

const Gameplay = () => {
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

  const setColToBlank = useCallback(
    (index) => {
      const col = index % WIDTH;
      for (let i = 0; i < WIDTH; i++) {
        currentGems.current[col + i * WIDTH].color = blank;
        currentGems.current[col + i * WIDTH].modifier = "";
      }
      updateScore(WIDTH);
      playSound("lineBlast");
    },
    [updateScore, playSound]
  );

  const setRowToBlank = useCallback(
    (index) => {
      const row = Math.floor(index / WIDTH);
      for (let i = row * WIDTH; i < row * WIDTH + WIDTH; i++) {
        currentGems.current[i].color = blank;
        currentGems.current[i].modifier = "";
      }
      updateScore(WIDTH);
      playSound("lineBlast");
    },
    [updateScore, playSound]
  );

  // Check for EXACTLY 4 matches in columns
  const checkForColumnFour = useCallback(
    (swapIndexes = null) => {
      let foundMatch = false;

      for (let i = 0; i < WIDTH * WIDTH - 3 * WIDTH; i++) {
        const column = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3];
        const decidedColor = currentGems.current[i].color;

        if (decidedColor === blank) continue;

        // Check if all 4 match
        if (
          column.every((idx) => currentGems.current[idx].color === decidedColor)
        ) {
          foundMatch = true;
          updateScore(4);
          playSound("matchOfFour");

          // Determine where sword appears
          let swordIndex = column[1]; // Default: 2nd position
          if (swapIndexes && column.includes(swapIndexes[0])) {
            swordIndex = swapIndexes[0]; // Spawn at swap origin
          } else if (swapIndexes && column.includes(swapIndexes[1])) {
            swordIndex = swapIndexes[1];
          }

          // Process each tile in the match
          column.forEach((idx) => {
            if (currentGems.current[idx].modifier === "vertical-sword") {
              // Existing sword in match → activate it
              setColToBlank(idx);
            } else if (
              currentGems.current[idx].modifier === "horizontal-sword"
            ) {
              setRowToBlank(idx);
            } else if (idx === swordIndex) {
              // Create vertical sword at this position
              currentGems.current[idx].modifier = "vertical-sword";
            } else {
              // Clear normal gem
              currentGems.current[idx].color = blank;
              currentGems.current[idx].modifier = "";
            }
          });

          return true; // Found one match, stop checking
        }
      }

      return foundMatch;
    },
    [updateScore, playSound, setColToBlank, setRowToBlank]
  );

  // Check for EXACTLY 4 matches in rows
  const checkForRowFour = useCallback(
    (swapIndexes = null) => {
      let foundMatch = false;

      for (let i = 0; i < WIDTH * WIDTH; i++) {
        const row = [i, i + 1, i + 2, i + 3];
        const decidedColor = currentGems.current[i].color;

        // Check if row wraps around
        if (i % WIDTH > WIDTH - 4 || decidedColor === blank) continue;

        // Check if all 4 match
        if (
          row.every((idx) => currentGems.current[idx].color === decidedColor)
        ) {
          foundMatch = true;
          updateScore(4);
          playSound("matchOfFour");

          // Determine where sword appears
          let swordIndex = row[1]; // Default: 2nd position
          if (swapIndexes && row.includes(swapIndexes[0])) {
            swordIndex = swapIndexes[0]; // Spawn at swap origin
          } else if (swapIndexes && row.includes(swapIndexes[1])) {
            swordIndex = swapIndexes[1];
          }

          // Process each tile in the match
          row.forEach((idx) => {
            if (currentGems.current[idx].modifier === "vertical-sword") {
              // Existing sword in match → activate it
              setColToBlank(idx);
            } else if (
              currentGems.current[idx].modifier === "horizontal-sword"
            ) {
              setRowToBlank(idx);
            } else if (idx === swordIndex) {
              // Create horizontal sword at this position
              currentGems.current[idx].modifier = "horizontal-sword";
            } else {
              // Clear normal gem
              currentGems.current[idx].color = blank;
              currentGems.current[idx].modifier = "";
            }
          });

          return true; // Found one match, stop checking
        }
      }

      return foundMatch;
    },
    [updateScore, playSound, setColToBlank, setRowToBlank]
  );

  // Check for regular 3-matches (no sword creation)
  const checkForThree = useCallback(() => {
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
        updateScore(3);

        column.forEach((idx) => {
          if (currentGems.current[idx].modifier === "vertical-sword") {
            setColToBlank(idx);
          } else if (currentGems.current[idx].modifier === "horizontal-sword") {
            setRowToBlank(idx);
          } else {
            currentGems.current[idx].color = blank;
            currentGems.current[idx].modifier = "";
          }
        });

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
        updateScore(3);

        row.forEach((idx) => {
          if (currentGems.current[idx].modifier === "vertical-sword") {
            setColToBlank(idx);
          } else if (currentGems.current[idx].modifier === "horizontal-sword") {
            setRowToBlank(idx);
          } else {
            currentGems.current[idx].color = blank;
            currentGems.current[idx].modifier = "";
          }
        });

        return true;
      }
    }

    return foundMatch;
  }, [updateScore, setColToBlank, setRowToBlank]);

  const moveIntoGemBelow = useCallback(() => {
    let moved = false;

    for (let i = WIDTH * WIDTH - 1; i >= 0; i--) {
      const isFirstRow = i < WIDTH;

      if (isFirstRow && currentGems.current[i].color === blank) {
        const randomColor =
          gemColors[Math.floor(Math.random() * gemColors.length)];
        currentGems.current[i].color = randomColor;
        currentGems.current[i].modifier = "";
        moved = true;
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
      }
    }

    return moved;
  }, []);

  const processMatches = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    let hasChanges = true;
    let cascadeCount = 0;

    while (hasChanges && cascadeCount < MAX_CASCADES) {
      hasChanges = false;
      cascadeCount++;

      // Priority: Check 4-matches first, then 3-matches
      const foundFourColumn = checkForColumnFour();
      const foundFourRow = !foundFourColumn && checkForRowFour();
      const foundThree = !(foundFourColumn || foundFourRow) && checkForThree();

      if (foundFourColumn || foundFourRow || foundThree) {
        hasChanges = true;
        // CRITICAL: Update display immediately after match
        setGems([...currentGems.current]);
        await new Promise((resolve) =>
          requestAnimationFrame(() => {
            setTimeout(resolve, 50);
          })
        );
      }

      const moved = moveIntoGemBelow();
      if (moved) {
        hasChanges = true;
        // CRITICAL: Update display immediately after move
        setGems([...currentGems.current]);
        await new Promise((resolve) =>
          requestAnimationFrame(() => {
            setTimeout(resolve, 50);
          })
        );
      }
    }

    // CRITICAL: Final sync to ensure display matches data
    setGems([...currentGems.current]);
    setIsProcessing(false);
  }, [
    isProcessing,
    checkForColumnFour,
    checkForRowFour,
    checkForThree,
    moveIntoGemBelow,
  ]);

  const swapGems = useCallback(
    async (index1, index2) => {
      if (isProcessing) return;
      setIsProcessing(true);

      const gem1 = currentGems.current[index1];
      const gem2 = currentGems.current[index2];

      const isSword1 =
        gem1.modifier === "vertical-sword" ||
        gem1.modifier === "horizontal-sword";
      const isSword2 =
        gem2.modifier === "vertical-sword" ||
        gem2.modifier === "horizontal-sword";

      // SWORD + SWORD = CROSS BLAST (no color check needed)
      if (isSword1 && isSword2) {
        setRowToBlank(index1);
        setColToBlank(index1);
        setSelectedGem(null);
        setGems([...currentGems.current]); // Sync immediately
        playSound("correctMove");
        await processMatches();
        return;
      }

      // SWORD + ANY GEM = ACTIVATE (no color check needed - Royal Match style)
      if (isSword1) {
        if (gem1.modifier === "vertical-sword") {
          setColToBlank(index1);
        } else {
          setRowToBlank(index1);
        }
        setSelectedGem(null);
        setGems([...currentGems.current]); // Sync immediately
        playSound("correctMove");
        await processMatches();
        return;
      }

      if (isSword2) {
        if (gem2.modifier === "vertical-sword") {
          setColToBlank(index2);
        } else {
          setRowToBlank(index2);
        }
        setSelectedGem(null);
        setGems([...currentGems.current]); // Sync immediately
        playSound("correctMove");
        await processMatches();
        return;
      }

      // REGULAR SWAP
      const tempColor = gem1.color;
      const tempModifier = gem1.modifier;

      currentGems.current[index1].color = gem2.color;
      currentGems.current[index1].modifier = gem2.modifier;
      currentGems.current[index2].color = tempColor;
      currentGems.current[index2].modifier = tempModifier;

      // CRITICAL: Show swap immediately
      setGems([...currentGems.current]);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if swap created a match (pass swap indexes for sword positioning)
      const foundFourColumn = checkForColumnFour([index1, index2]);
      const foundFourRow =
        !foundFourColumn && checkForRowFour([index1, index2]);
      const foundThree = !(foundFourColumn || foundFourRow) && checkForThree();

      if (foundFourColumn || foundFourRow || foundThree) {
        playSound("correctMove");
        setSelectedGem(null);
        setGems([...currentGems.current]); // Sync immediately
        await processMatches();
      } else {
        // Swap back - invalid move
        currentGems.current[index2].color = gem1.color;
        currentGems.current[index2].modifier = gem1.modifier;
        currentGems.current[index1].color = tempColor;
        currentGems.current[index1].modifier = tempModifier;

        setGems([...currentGems.current]); // Sync immediately
        playSound("wrongMove");
        setIsProcessing(false);
      }
    },
    [
      isProcessing,
      checkForColumnFour,
      checkForRowFour,
      checkForThree,
      processMatches,
      playSound,
      setRowToBlank,
      setColToBlank,
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
    [selectedGem, isProcessing, swapGems, playSound]
  );

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
  }, [selectedGem, isProcessing, swapGems]);

  const createBoard = useCallback(() => {
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
  }, [createBoard]);

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
      <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
        <p className="font-bold mb-1">🎮 Royal Match Style</p>
        <p>🖱️ Click gem to select</p>
        <p>⌨️ Arrow keys to swap</p>
        <p>⚔️ Sword + ANY gem = Blast!</p>
        <p>ESC to deselect</p>
      </div>

      <div className="text-2xl px-6 py-3 mb-4 bg-purple-700 text-white rounded-md border-2 border-white pointer-events-none">
        <span>Score: </span> <b>{score}</b>
      </div>

      <div className="relative w-[90vw] max-w-[560px] aspect-square">
        <img
          src={boardFrame}
          alt="Board Frame"
          className="absolute inset-0 w-full h-full z-20 pointer-events-none select-none"
        />

        <div className="tile-grid absolute inset-[8%] flex flex-wrap z-10">
          {gems.map((gem, index) => (
            <GemCell
              key={index}
              gem={gem}
              index={index}
              isProcessing={isProcessing}
              isSelected={selectedGem === index}
              onClick={handleGemClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gameplay;
