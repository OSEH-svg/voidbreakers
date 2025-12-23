import { useCallback } from "react";

export const createTile = (color, modifier = "") => ({
  color,
  modifier,
  orientation: "",
  isSword: false,
  swordColor: null,
});

export const GEM_COLOR_MAP = {
  yellowGem: "yellow",
  blueGem: "blue",
  greenGem: "green",
  purpleGem: "purple",
  redGem: "red",
  orangeGem: "orange",
};

export const SWORD_CONFIG = {
  orientations: {
    vertical: { rotation: 0, transformOrigin: "center center" },
    horizontal: { rotation: 90, transformOrigin: "center center" },
  },
  colors: {
    yellow: { filter: "hue-rotate(50deg) saturate(1.2)", glow: "#FFD700" },
    blue: { filter: "hue-rotate(200deg) saturate(1.2)", glow: "#4169E1" },
    green: { filter: "hue-rotate(120deg) saturate(1.2)", glow: "#32CD32" },
    purple: { filter: "hue-rotate(280deg) saturate(1.2)", glow: "#9370DB" },
    red: { filter: "hue-rotate(0deg) saturate(1.2)", glow: "#FF6347" },
    orange: { filter: "hue-rotate(30deg) saturate(1.2)", glow: "#FF8C00" },
  },
};

export const getColorName = (gemImage) => {
  if (!gemImage) return "blue";
  const imageName = gemImage.split("/").pop().replace(".png", "");
  return GEM_COLOR_MAP[imageName] || "blue";
};

export const Match4Logic = {
  shouldCreateSword: (matchLength, isPartOfMatch, tileIndex) => {
    return matchLength >= 4 && isPartOfMatch.includes(tileIndex);
  },

  createSwordTile: (tile, orientation, matchColor) => {
    const colorName = getColorName(matchColor);
    console.log("Creating sword:", {
      orientation,
      matchColor,
      colorName,
      tile,
    });
    return {
      ...tile,
      modifier: "sword",
      orientation,
      isSword: true,
      swordColor: colorName,
    };
  },

  // Get sword visual properties for rendering
  getSwordVisualProps: (tile) => {
    if (!tile.isSword) return null;

    const config = SWORD_CONFIG;
    const orientation = config.orientations[tile.orientation];
    const colorConfig = config.colors[tile.swordColor] || config.colors.blue;

    return {
      rotation: orientation.rotation,
      transformOrigin: orientation.transformOrigin,
      filter: colorConfig.filter,
      glowColor: colorConfig.glow,
    };
  },

  shouldActivateSword: (currentTile, targetTile) => {
    if (!currentTile.isSword || !targetTile.color) return false;

    const targetColorName = getColorName(targetTile.color);

    // Sword + normal gem of same color
    if (currentTile.swordColor === targetColorName) {
      return {
        type: "normal-blast",
        direction: currentTile.orientation,
        targetColor: targetColorName,
      };
    }

    // Sword + sword combination
    if (
      targetTile.isSword &&
      currentTile.swordColor === targetTile.swordColor
    ) {
      return {
        type: "cross-blast",
        directions: [currentTile.orientation, targetTile.orientation],
        targetColor: currentTile.swordColor,
      };
    }

    return null;
  },

  getBlastEffect: (activationType, tileIndex, boardWidth) => {
    const row = Math.floor(tileIndex / boardWidth);
    const col = tileIndex % boardWidth;

    switch (activationType.type) {
      case "normal-blast":
        if (activationType.direction === "vertical") {
          // Column blast
          return {
            type: "column",
            indexes: Array.from({ length: 8 }, (_, i) => col + i * boardWidth),
          };
        } else {
          // Row blast
          return {
            type: "row",
            indexes: Array.from({ length: 8 }, (_, i) => row * boardWidth + i),
          };
        }

      case "cross-blast":
        // Cross blast 
        const rowIndexes = Array.from(
          { length: 8 },
          (_, i) => row * boardWidth + i
        );
        const colIndexes = Array.from(
          { length: 8 },
          (_, i) => col + i * boardWidth
        );
        return {
          type: "cross",
          indexes: [...new Set([...rowIndexes, ...colIndexes])],
        };

      default:
        return { type: "none", indexes: [] };
    }
  },

  getSwordClassName: (tile, isAnimating = false) => {
    const baseClasses = ["sword-tile"];

    if (tile.isSword) {
      baseClasses.push(`sword-${tile.orientation}`, `sword-${tile.swordColor}`);

      if (isAnimating) {
        baseClasses.push("sword-pulse");
      }
    }

    return baseClasses.join(" ");
  },

  detectMatches: (tiles, boardWidth) => {
    const matches = [];
    const swordsToCreate = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col <= 8 - 3; col++) {
        const matchTiles = [];
        const baseColor = tiles[row * boardWidth + col].color;

        if (!baseColor || baseColor === "blank") continue;

        for (let i = 0; i < 8 - col; i++) {
          const tileIndex = row * boardWidth + col + i;
          if (tiles[tileIndex].color === baseColor) {
            matchTiles.push(tileIndex);
          } else {
            break;
          }
        }

        if (matchTiles.length >= 3) {
          const isPartOfMatch = matchTiles;
          const shouldCreateSword = matchTiles.length >= 4;

          matches.push({
            type: "horizontal",
            tiles: matchTiles,
            color: baseColor,
            length: matchTiles.length,
            isPartOfMatch,
            shouldCreateSword,
          });

          if (shouldCreateSword) {
            const swordIndex = matchTiles[Math.floor(matchTiles.length / 2)];
            swordsToCreate.push({
              index: swordIndex,
              orientation: "horizontal",
              color: baseColor,
            });
          }
        }
      }
    }

    // Check vertical matches (similar logic)
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row <= 8 - 3; row++) {
        const matchTiles = [];
        const baseColor = tiles[row * boardWidth + col].color;

        if (!baseColor || baseColor === "blank") continue;

        for (let i = 0; i < 8 - row; i++) {
          const tileIndex = (row + i) * boardWidth + col;
          if (tiles[tileIndex].color === baseColor) {
            matchTiles.push(tileIndex);
          } else {
            break;
          }
        }

        if (matchTiles.length >= 3) {
          const isPartOfMatch = matchTiles;
          const shouldCreateSword = matchTiles.length >= 4;

          matches.push({
            type: "vertical",
            tiles: matchTiles,
            color: baseColor,
            length: matchTiles.length,
            isPartOfMatch,
            shouldCreateSword,
          });

          if (shouldCreateSword) {
            const swordIndex = matchTiles[Math.floor(matchTiles.length / 2)];
            swordsToCreate.push({
              index: swordIndex,
              orientation: "vertical",
              color: baseColor,
            });
          }
        }
      }
    }

    return { matches, swordsToCreate };
  },
};
