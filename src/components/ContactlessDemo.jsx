import React, { useState, useRef, useEffect } from 'react';
import { useContactless } from 'react-kinetic-ui';
import { Camera, CameraOff, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function ContactlessDemo() {
  const [isActive, setIsActive] = useState(false);
  const [lastGesture, setLastGesture] = useState('Waiting for gesture...');
  
  // Motion values to drive our cursor dot smoothly
  const x = useMotionValue(150);
  const y = useMotionValue(150);
  const springX = useSpring(x, { stiffness: 400, damping: 25 });
  const springY = useSpring(y, { stiffness: 400, damping: 25 });

  const videoRef = useRef(null);

  const { start, stop, isReady } = useContactless((results) => {
    // Coordinate mapping (simplified to map to container)
    if (results.landmarks && results.landmarks.length > 0) {
      // Index 8 is the index finger tip in MediaPipe
      const tipX = results.landmarks[0][8].x;
      const tipY = results.landmarks[0][8].y;
      
      // Map normalized 0-1 values back into container bounds (roughly 300px)
      x.set(tipX * 300);
      y.set(tipY * 300);
    }

    if (results.semanticGesture) {
      setLastGesture(`Detected: ${results.semanticGesture}`);
    }
  });

  useEffect(() => {
    if (isActive && videoRef.current) {
      start(videoRef.current);
    }
  }, [isActive, start]);

  const handleToggle = () => {
    if (isActive) {
      stop();
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col items-center gap-6 relative overflow-hidden h-full">
      <div className="text-center w-full flex justify-between items-center">
        <h3 className="heading-md flex items-center gap-2">
          <Camera className="text-accent-blue" strokeWidth={1.5} /> Contactless
        </h3>
        <button 
          onClick={handleToggle}
          className={`px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-sm font-medium transition-all ${isActive ? 'bg-red-500/20 text-red-300' : 'bg-white/5 hover:bg-white/10 text-white'}`}
        >
           {isActive ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>

      {isActive ? (
        <div className="w-full aspect-square border border-white/10 rounded-2xl relative overflow-hidden bg-black/40">
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center text-sub">
              Loading AI Models...
            </div>
          )}
          
          <motion.div 
            className="absolute w-8 h-8 rounded-full bg-accent-blue opacity-80 backdrop-blur"
            style={{ 
              x: springX, 
              y: springY,
              boxShadow: '0 0 20px var(--color-accent-blue)' 
            }}
          />
          
          <div className="absolute bottom-4 left-0 w-full text-center">
             <div className="glass-pill inline-flex items-center gap-2 text-sm font-semibold text-accent-blue bg-blue-900/40">
                <Sparkles size={16} /> {lastGesture}
             </div>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-square border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-sub gap-4">
          <CameraOff size={48} strokeWidth={1} style={{ opacity: 0.2 }} />
          Enable to test hand tracking
        </div>
      )}
    </div>
  );
}
