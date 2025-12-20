import React, { useState, useEffect } from 'react';

const RotatePrompt = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth <= 768;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white',
      fontFamily: 'JungleAdventurer, serif',
    }}>
      <div style={{ 
        fontSize: '64px', 
        marginBottom: '20px',
        animation: 'rotate 2s ease-in-out infinite'
      }}>
        📱
      </div>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
        Please rotate your device
      </h2>
      <p style={{ fontSize: '16px', opacity: 0.8 }}>
        This game is best played in landscape mode
      </p>
      <style>
        {`
          @keyframes rotate {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(90deg); }
          }
        `}
      </style>
    </div>
  );
};

export default RotatePrompt;