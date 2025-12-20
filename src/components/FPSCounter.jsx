// src/components/FPSCounter.jsx
import { useEffect, useState } from 'react';

const FPSCounter = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    const id = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono">
      {fps} FPS
    </div>
  );
};

export default FPSCounter;