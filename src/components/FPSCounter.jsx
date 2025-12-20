import { useEffect, useState } from "react";

const FPSCounter = () => {
  const [fps, setFps] = useState(60);
  const frameTimes = [];

  useEffect(() => {
    let animationId;
    let lastTime = performance.now();

    const measureFPS = (currentTime) => {
      // Calculate time since last frame
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Store frame time
      frameTimes.push(deltaTime);

      // Keep only the last 60 frame times
      if (frameTimes.length > 60) {
        frameTimes.shift();
      }

      // Calculate average FPS over the last 60 frames
      const averageFrameTime =
        frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
      const currentFps = Math.round(1000 / averageFrameTime);

      setFps(currentFps);

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const getFPSColor = (fps) => {
    if (fps >= 55) return "text-green-400"; // Good performance
    if (fps >= 30) return "text-yellow-400"; // Moderate performance
    return "text-red-400"; // Poor performance
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/70 text-white px-3 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-mono">FPS:</span>
        <span className={`text-lg font-bold font-mono ${getFPSColor(fps)}`}>
          {fps}
        </span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${
            fps >= 55
              ? "bg-green-400"
              : fps >= 30
              ? "bg-yellow-400"
              : "bg-red-400"
          }`}
          style={{ width: `${Math.min((fps / 60) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default FPSCounter;
