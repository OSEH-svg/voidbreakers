import greenGem from "../../assets/gameGems/greenGem.png";
import blueGem from "../../assets/gameGems/blueGem.png";
import coinSvg from "../../assets/icons/coin.svg";
import swordSvg from "../../assets/icons/sword.svg";

const ObjectivesPanel = ({ level, progress, movesRemaining }) => {
  const getAsset = (path) => {
    const assetMap = {
      "src/assets/gameGems/greenGem.png": greenGem,
      "src/assets/gameGems/blueGem.png": blueGem,
      "src/assets/icons/coin.svg": coinSvg,
      "src/assets/icons/sword.svg": swordSvg,
    };
    return assetMap[path];
  };
  if (!level) return null;

  return (
    <div className="objectives-speech-bubble">
      <div className="marble-texture"></div>

      <div className="text-center mb-1 relative z-10">
        <h2 className="font-sportize font-extralight text-lg text-white">
          LVL {level.id} - {level.name}
        </h2>
      </div>

      <div className="space-y-1.5 mb-2 relative z-10">
        {level.objectives.map((objective, index) => {
          const currentProgress = progress[index] || 0;
          const isComplete = currentProgress >= objective.amount;
          const progressPercent = Math.min(
            (currentProgress / objective.amount) * 100,
            100
          );

          return (
            <div key={index} className="objective-item">
              {/* Compact Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {objective.emoji.startsWith("src/") ? (
                    <img
                      src={getAsset(objective.emoji)}
                      alt={objective.targetName}
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <span className="text-lg leading-none">
                      {objective.emoji}
                    </span>
                  )}
                  <span className="font-sportize text-s leading-tight">
                    {objective.targetName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm font-black leading-none ${
                      isComplete ? "text-green-700" : "text-zinc-800"
                    }`}
                  >
                    {currentProgress}/{objective.amount}
                  </span>
                  {isComplete && (
                    <span className="text-green-700 text-sm">✓</span>
                  )}
                </div>
              </div>

              <div className="compact-progress-bar">
                <div
                  className={`compact-progress-fill ${
                    isComplete
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ObjectivesPanel;
