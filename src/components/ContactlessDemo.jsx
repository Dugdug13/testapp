import { useState, useRef, useEffect, useCallback } from 'react';
import { useContactless } from 'react-kinetic-ui';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CameraOff, Hand, Zap, Sparkles, Activity } from 'lucide-react';

const ContactlessDemo = () => {
  const [active, setActive] = useState(false);
  const [gesture, setGesture] = useState(null);
  const [lastGestureTime, setLastGestureTime] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Handle gesture callback
  const onGesture = useCallback(({ results, semanticGesture }) => {
    if (semanticGesture) {
      setGesture(semanticGesture);
      setLastGestureTime(Date.now());
    }
    
    // Draw landmarks if active
    if (canvasRef.current && results.landmarks && results.landmarks.length > 0) {
      const ctx = canvasRef.current.getContext('2d');
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!video) return;

      // Match canvas to video dimensions
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw hand skeleton
      results.landmarks.forEach(hand => {
        // Draw points
        ctx.fillStyle = '#3b82f6';
        hand.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x * canvas.width, point.y * canvas.height, 3, 0, 2 * Math.PI);
          ctx.fill();
        });

        // Draw connections (Simplified for premium look)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2;
        
        // Define connections (Standard MediaPipe hand landmarks)
        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4], // thumb
          [0, 5], [5, 6], [6, 7], [7, 8], // index
          [5, 9], [9, 10], [10, 11], [11, 12], // middle
          [9, 13], [13, 14], [14, 15], [15, 16], // ring
          [13, 17], [17, 18], [18, 19], [19, 20], [0, 17] // pinky
        ];

        connections.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(hand[i].x * canvas.width, hand[i].y * canvas.height);
          ctx.lineTo(hand[j].x * canvas.width, hand[j].y * canvas.height);
          ctx.stroke();
        });
      });
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  const { start, stop, isReady } = useContactless(onGesture, {
    swipeThreshold: 0.15,
    numHands: 2
  });

  const toggleCamera = async () => {
    if (active) {
      stop();
      setActive(false);
      setGesture(null);
    } else {
      await start(videoRef.current);
      setActive(true);
    }
  };

  // Clear gesture after a delay
  useEffect(() => {
    if (gesture) {
      const timer = setTimeout(() => {
        if (Date.now() - lastGestureTime >= 1500) {
          setGesture(null);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gesture, lastGestureTime]);

  return (
    <div className="glass-panel" ref={containerRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-md">Contactless Control</h2>
          <p className="text-sub">AI-powered hand gesture recognition</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isReady ? '#4ade80' : '#f87171' }}>
            <Activity size={14} />
            <span>{isReady ? 'Model Ready' : 'Initializing...'}</span>
          </div>
        </div>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        aspectRatio: '16/9', 
        backgroundColor: '#000', 
        borderRadius: '20px', 
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {!active && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 10,
            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent)'
          }}>
            <Hand size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <button 
              onClick={toggleCamera}
              disabled={!isReady}
              style={{ 
                padding: '12px 24px', 
                borderRadius: '12px', 
                backgroundColor: isReady ? 'var(--accent-blue)' : '#333',
                color: '#fff',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Camera size={18} />
              Enable Spatial Camera
            </button>
          </div>
        )}

        <video 
          ref={videoRef} 
          className="mirror"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: active ? 'block' : 'none'
          }} 
          muted 
          playsInline 
        />
        
        <canvas 
          ref={canvasRef}
          className="mirror"
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />

        {active && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
            <button 
              onClick={toggleCamera}
              style={{ 
                padding: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <CameraOff size={18} />
            </button>
          </div>
        )}

        {/* Gesture Feedback Overlay */}
        <AnimatePresence>
          {gesture && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -20 }}
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                padding: '12px 32px',
                borderRadius: '100px',
                background: 'rgba(59, 130, 246, 0.9)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)'
              }}
            >
              <Zap size={24} fill="currentColor" />
              {gesture.toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner Line */}
        {active && (
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(to right, transparent, var(--accent-blue), transparent)',
              zIndex: 4,
              boxShadow: '0 0 15px var(--accent-blue)'
            }}
          />
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <p className="text-sub" style={{ marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} className="text-accent-blue" />
          AVAILABLE GESTURES
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Single Finger', icon: '☝️' },
            { label: 'V-shape', icon: '✌️' },
            { label: 'Open Palm', icon: '✋' },
            { label: 'Fist', icon: '✊' },
            { label: 'Right Swipe', icon: '➡️' },
            { label: 'Left Swipe', icon: '⬅️' },
            { label: 'Double Palm', icon: '✋✋' },
            { label: 'Asalam walekum Lyaari', icon: '🙏' }
          ].map((item) => (
            <div key={item.label} className="glass-pill" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: gesture === item.label ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
              borderColor: gesture === item.label ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.05)',
              transition: 'all 0.3s'
            }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ fontWeight: gesture === item.label ? 700 : 400, fontSize: '0.75rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactlessDemo;