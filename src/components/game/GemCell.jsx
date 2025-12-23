import { memo } from "react";
import sword from "../../assets/icons/sword.png";


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
            : "border-white/5 hover:border-white/30 hover:bg-white/5 bg-white/2"
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
            isSword ? (isHorizontal ? "sword-horizontal" : "sword-vertical") : ""
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

export default GemCell;