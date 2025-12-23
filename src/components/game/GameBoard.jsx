import boardFrame from "../../assets/images/boardFrame.svg";
import cadenHero from "../../assets/images/cadenHero.png";
import coinIcon from "../../assets/icons/coin.svg";
import chest from "../../assets/icons/chest.svg";
import movesIcon from "../../assets/icons/movesIcon.png";
import GemCell from "./GemCell";
import ObjectivesPanel from "./ObjectivesPanel";


const GameBoard = ({
  level,
  gems,
  score,
  selectedGem,
  isProcessing,
  onGemClick,
  movesRemaining,
  progress,
}) => {
  return (
    <div className="w-screen h-screen flex items-stretch overflow-hidden relative select-none">
      <div className="w-1/2 flex flex-col justify-between p-4 pl-0">
        <div className="flex ml-4 mt-4 gap-100">
          <div className="flex items-center ml-10 gap-1 text-white font-sportize">
            <img
              src={coinIcon}
              alt="Coin"
              className="w-16 h-16 object-contain flex-shrink-0"
            />
            <span className="text-xl font-extrabold">{score}</span>
            <div className="ml-6">
              <img
                src={chest}
                alt="Chest"
                className="w-16 h-16 object-contain flex-shrink-0"
              />
            </div>
          </div>

          <div
            className="flex items-center gap-3 ml-60"
          >
            <span className="text-lg text-white font-sportize">Moves:</span>
            <div className="relative w-16 h-16">
              <img
                src={movesIcon}
                alt="Moves Icon"
                className="w-full h-full object-contain flex-shrink-0"
              />
              <span
                className={`absolute inset-0 flex items-center justify-center text-lg font-black leading-none ${
                  movesRemaining <= 5
                    ? "text-red-400 animate-pulse"
                    : movesRemaining <= 10
                    ? "text-yellow-300"
                    : "text-white"
                }`}
              >
                {movesRemaining}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-center h-full relative">
          <img
            src={cadenHero}
            alt="Caden Hero"
            className="max-w-full max-h-full object-contain object-bottom"
            style={{ maxHeight: "60vh" }}
          />

          <div className="absolute top-25 left-[70%] transform -translate-x-1/2 z-30">
            <div className="relative">
              <ObjectivesPanel
                level={level}
                progress={progress}
                movesRemaining={movesRemaining}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="relative w-full max-w-[550px] aspect-square">
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
                onClick={onGemClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
