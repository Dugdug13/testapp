import React, { useState, useRef, useEffect } from 'react';
import { useContactless } from 'react-kinetic-ui';
import { Camera, CameraOff, Sparkles, AlertCircle } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function ContactlessDemo() {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('System Initializing...');
  const [error, setError] = useState(null);
  
  // Motion values for smooth cursor
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const springX = useSpring(x, { stiffness: 500, damping: 30 });
  const springY = useSpring(y, { stiffness: 500, damping: 30 });

  const videoRef = useRef(null);

  const { start, stop, isReady } = useContactless((data) => {
    try {
      const { results, semanticGesture } = data;
      
      if (results?.landmarks?.length > 0) {
        // Use Index Finger Tip (Landmark 8)
        const tip = results.landmarks[0][8];
        // Map 0-1 to 0-400 (container size)
        // Note: Camera is mirrored usually, so we might need 1 - tip.x
        x.set((1 - tip.x) * 400); 
        y.set(tip.y * 400);

        if (semanticGesture) {
          setStatus(`Detected: ${semanticGesture.replace(/_/g, ' ')}`);
        } else {
          const raw = results.gestures?.[0]?.[0]?.categoryName;
          if (raw && raw !== 'None') {
             setStatus(`Hand: ${raw.replace(/_/g, ' ')}`);
          } else {
             setStatus('Tracking Hand...');
          }
        }
      } else {
        setStatus('No Hand Detected');
      }
    } catch (err) {
      console.error("Gesture processing error:", err);
    }
  });

  useEffect(() => {
    if (isReady) setStatus('Ready! Start camera to test.');
  }, [isReady]);

  useEffect(() => {
    if (isActive && videoRef.current && isReady) {
      start(videoRef.current).catch(err => {
        setError('Camera Access Denied');
        setIsActive(false);
      });
    }
  }, [isActive, isReady, start]);

  const handleToggle = () => {
    if (isActive) {
      stop();
      setIsActive(false);
      setStatus('Camera Stopped');
    } else {
      setError(null);
      setIsActive(true);
      setStatus('Starting Camera...');
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 h-full min-h-[500px]">
      <div className="flex justify-between items-center">
        <h3 className="heading-md flex items-center gap-2 m-0">
          <Camera className="text-accent-pink" strokeWidth={1.5} /> Contactless
        </h3>
        <button 
          onClick={handleToggle}
          disabled={!isReady}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            isActive 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-accent-pink/10 text-accent-pink border border-accent-pink/30 hover:bg-accent-pink/20'
          } ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
           {isActive ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      <div className="flex-1 relative bg-black/20 rounded-2xl border border-white/5 overflow-hidden min-h-[300px]">
        {isActive ? (
          <>
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover mirror"
              playsInline
              autoPlay
              muted
              style={{ transform: 'scaleX(-1)' }} // Mirror the video
            />
            
            {/* The Cursor */}
            <motion.div 
              className="absolute w-6 h-6 rounded-full bg-accent-pink shadow-[0_0_20px_var(--color-accent-pink)] z-10"
              style={{ x: springX, y: springY, left: -12, top: -12 }}
            />

            <div className="absolute bottom-6 left-0 w-full flex justify-center p-4">
              <div className="glass-pill bg-black/60 text-accent-pink font-bold flex items-center gap-2 border-accent-pink/30">
                <Sparkles size={16} /> {status}
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-sub">
            {error ? (
              <div className="flex flex-col items-center gap-2 text-red-400">
                <AlertCircle size={40} />
                <span>{error}</span>
              </div>
            ) : (
              <>
                <CameraOff size={40} className="opacity-20" />
                <span className="text-sm">{isReady ? 'Ready to track' : 'Loading AI Models...'}</span>
              </>
            )}
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-sub text-center opacity-50">
        Best in good lighting. Mirrored for natural interaction.
      </p>
    </div>
  );
}
