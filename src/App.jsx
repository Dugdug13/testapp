import React, { useState } from 'react';
import { useSwipe, useSensor, DragGesture } from 'react-kinetic-ui';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Kinetic UI Demo App
 * 
 * Demonstrates local development of react-kinetic-ui via symlink.
 */
const App = () => {
  const [activeTab, setActiveTab] = useState('swipe');
  const [swipeState, setSwipeState] = useState(null);
  const [sensorData, setSensorData] = useState(null);

  // 1. Swipe Hook Example
  const swipeBind = useSwipe((state) => {
    setSwipeState(state);
  });

  // 2. Sensor Hook Example
  const { requestPermission, permissionGranted, isSupported } = useSensor((data) => {
    setSensorData(data);
  });

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 className="text-gradient">Kinetic UI Beta</h1>
        <p style={{ opacity: 0.6 }}>Local Symlink Development Environment</p>
      </header>

      <nav style={navStyle}>
        <button
          style={activeTab === 'swipe' ? activeNavStyle : navBtnStyle}
          onClick={() => setActiveTab('swipe')}
        >
          Swipe Hook
        </button>
        <button
          style={activeTab === 'drag' ? activeNavStyle : navBtnStyle}
          onClick={() => setActiveTab('drag')}
        >
          Drag Component
        </button>
        <button
          style={activeTab === 'sensor' ? activeNavStyle : navBtnStyle}
          onClick={() => setActiveTab('sensor')}
        >
          Sensor Hook
        </button>
      </nav>

      <main style={mainStyle}>
        {activeTab === 'swipe' && (
          <section className="glass-panel" style={cardStyle} {...swipeBind}>
            <AnimatePresence>
              {(!swipeState || !swipeState.active) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ fontSize: '3rem' }}>👆</div>
                  <p>Swipe inside this card</p>
                </motion.div>
              )}
            </AnimatePresence>
            {swipeState?.active && (
              <motion.div
                style={indicatorStyle}
                animate={{ x: swipeState.distance.x, y: swipeState.distance.y }}
              />
            )}
            <div style={statsOverlay}>
              <span>Direction: {swipeState?.direction || 'Static'}</span>
              <span>Velocity: {swipeState?.velocity.toFixed(2) || '0.00'}</span>
            </div>
          </section>
        )}

        {activeTab === 'drag' && (
          <div style={{ padding: '50px' }}>
            <DragGesture>
              <div style={dragBoxStyle}>
                Drag Me Anywhere
              </div>
            </DragGesture>
          </div>
        )}

        {activeTab === 'sensor' && (
          <div className="glass-panel" style={cardStyle}>
            {!permissionGranted ? (
              <button onClick={requestPermission} style={primaryBtnStyle}>
                Enable Device Sensors
              </button>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p>Tilt your device</p>
                <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                  A: {sensorData?.alpha.toFixed(0)}°
                  B: {sensorData?.beta.toFixed(0)}°
                  G: {sensorData?.gamma.toFixed(0)}°
                </div>
              </div>
            )}
            {!isSupported && <p style={{ color: '#ff4444' }}>Not supported on this browser</p>}
          </div>
        )}
      </main>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  padding: '2rem',
  background: '#0a0a0c',
  color: '#fff',
  fontFamily: 'Inter, sans-serif'
};

const headerStyle = { textAlign: 'center', marginBottom: '2rem' };

const navStyle = { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' };

const navBtnStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer'
};

const activeNavStyle = {
  ...navBtnStyle,
  background: '#3b82f6',
  borderColor: '#3b82f6'
};

const mainStyle = { display: 'flex', justifyContent: 'center' };

const cardStyle = {
  width: '320px',
  height: '320px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  userSelect: 'none'
};

const indicatorStyle = {
  width: '40px',
  height: '40px',
  background: 'linear-gradient(45deg, #00f0ff, #9d00ff)',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
};

const statsOverlay = {
  position: 'absolute',
  bottom: '1rem',
  left: '1rem',
  right: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  opacity: 0.6
};

const dragBoxStyle = {
  width: '120px',
  height: '120px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '0.875rem'
};

const primaryBtnStyle = {
  padding: '0.75rem 1.5rem',
  background: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 600
};

export default App;
