import React, { useState } from 'react';
import { useSwipe } from 'react-kinetic-ui'; // Replace with the local path if testing without installing

const SwipeTest = () => {
  const [swipeData, setSwipeData] = useState(null);

  // Initialize the hook
  const bind = useSwipe((state) => {
    if (state.last) {
      setSwipeData(state);
      console.log('Swipe detected:', state);
    }
  }, { threshold: 30 }); // Trigger on small swipes

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Swipe Test</h1>
      
      <div 
        {...bind} 
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          cursor: 'pointer',
          touchAction: 'none' // Important for mobile testing
        }}
      >
        <p>Swipe inside this box</p>
      </div>

      {swipeData && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
          <h3>Last Swipe Result:</h3>
          <p><strong>Direction:</strong> {swipeData.direction || 'None'}</p>
          <p><strong>Velocity:</strong> {swipeData.velocity.toFixed(2)} px/ms</p>
          <p><strong>Distance (X, Y):</strong> {Math.round(swipeData.distance.x)}, {Math.round(swipeData.distance.y)}</p>
        </div>
      )}
    </div>
  );
};

export default SwipeTest;
