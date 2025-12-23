import { gemNames } from "../utils/gameConstants";

export const LEVELS = [
  {
    id: 1,
    name: "Green Garden",
    description: "Collect green gems to grow the garden!",
    objectives: [
      {
        type: "collect",
        targetType: "color",
        targetColor: "green",
        targetName: "Green Gems",
        amount: 15,
        emoji: "src/assets/gameGems/greenGem.png",
      },
    ],
    moves: 25,
    targetScore: 300, 
  },

  {
    id: 2,
    name: "Dual Challenge",
    description: "Reach the score target and collect blue gems!",
    objectives: [
      {
        type: "score",
        targetType: "points",
        targetName: "Score",
        amount: 100,
        emoji: "src/assets/icons/coin.svg",
      },
      {
        type: "collect",
        targetType: "color",
        targetColor: "blue",
        targetName: "Blue Gems",
        amount: 10,
        emoji: "src/assets/gameGems/blueGem.png",
      },
    ],
    moves: 20,
    targetScore: 100,
  },

  {
    id: 3,
    name: "Master Quest",
    description: "Create swords and reach high scores!",
    objectives: [
      {
        type: "score",
        targetType: "points",
        targetName: "Score",
        amount: 130,
        emoji: "src/assets/icons/coin.svg",
      },
      {
        type: "collect",
        targetType: "modifier",
        targetModifier: "sword",
        targetName: "Swords",
        amount: 5,
        emoji: "src/assets/icons/sword.svg",
      },
    ],
    moves: 15,
    targetScore: 130,
  },
];


export const getLevel = (levelId) => {
  return LEVELS.find((level) => level.id === levelId) || LEVELS[0];
};

export const getNextLevel = (currentLevelId) => {
  const currentIndex = LEVELS.findIndex((level) => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === LEVELS.length - 1) {
    return null;
  }
  return LEVELS[currentIndex + 1];
};
