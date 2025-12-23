import { useNavigate } from "react-router-dom";
import boardFrame from "../../assets/images/boardFrame.svg";
import btnBlue from "../../assets/icons/btnBlue.png";
import btnBlueFaded from "../../assets/icons/btnBlueFaded.png";
import btnGreen from "../../assets/icons/btnGreen.png";

const LevelResultModal = ({
  isOpen,
  isVictory,
  score,
  level,
  hasNextLevel,
  onNextLevel,
  onRetry,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn select-none">
      <div className="relative w-full max-w-md animate-scaleIn">
        <div
          className="relative bg-center bg-no-repeat bg-contain px-12 py-12"
          style={{ backgroundImage: `url(${boardFrame})` }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Result Header */}
            <div className="text-center">
              {isVictory ? (
                <>
                  <div className="text-6xl animate-bounce">🎉</div>
                  <h2 className="text-2xl font-bold text-yellow-400 drop-shadow-lg font-jungle">
                    LEVEL COMPLETE!
                  </h2>
                  <p className="text-purple-200 text-lg font-sportize font-extralight">
                    Amazing work! You completed {level?.name}!
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl">😢</div>
                  <h2 className="text-2xl font-bold text-red-600 drop-shadow-lg font-jungle">
                    LEVEL FAILED
                  </h2>
                  <p className="text-purple-200 text-lg font-sportize font-extralight">
                    Don't give up! Try again!
                  </p>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center gap-1 w-full">
              {isVictory && hasNextLevel ? (
                <button
                  className="relative flex justify-center items-center w-52 h-16"
                  onClick={onNextLevel}
                >
                  <img
                    src={btnGreen}
                    alt="Next Level"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute text-white font-jungle text-lg drop-shadow-lg">
                    Next Level
                  </span>
                </button>
              ) : isVictory ? (
                <div className="text-white font-bold py-3 px-6 rounded-xl text-center border-2 border-white/30">
                  <p className="text-lg mb-1">🎊 Demo Complete!</p>
                  <p className="text-sm text-purple-200">
                    More levels coming soon...{" "}
                  </p>
                </div>
              ) : null}

              <button
                className="relative flex justify-center items-center w-52 h-16"
                onClick={onRetry}
              >
                <img
                  src={btnBlue}
                  alt={isVictory ? "Play Again" : "Retry Level"}
                  className="w-full h-full object-contain"
                />
                <span className="absolute text-white font-jungle text-lg drop-shadow-lg">
                  {isVictory ? "Play Again" : "Retry Level"}
                </span>
              </button>

              <button
                className="relative flex justify-center items-center w-52 h-16"
                onClick={handleGoHome}
              >
                <img
                  src={btnBlueFaded}
                  alt="Back to Home"
                  className="w-full h-full object-contain"
                />
                <span className="absolute text-white font-jungle text-lg drop-shadow-lg">
                  Back to Home
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelResultModal;
