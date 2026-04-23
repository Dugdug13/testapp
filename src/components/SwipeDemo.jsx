import React, { useState } from 'react';
import { useSwipe } from 'react-kinetic-ui';
import TestLayout from './TestLayout';

const SwipeTest = () => {
  const [swipeData, setSwipeData] = useState(null);

  const bind = useSwipe((state) => {
    if (state.last) {
      setSwipeData(state);
      console.log(state);
    }
  }, { threshold: 30 });

  return (
    <TestLayout
      title="Swipe Gesture"
      subtitle="Swipe inside the box"
      result={
        swipeData && (
          <>
            <h3 className="heading-md">Last Swipe</h3>
            <p><strong>Direction:</strong> {swipeData.direction || 'None'}</p>
            <p><strong>Velocity:</strong> {swipeData.velocity.toFixed(2)}</p>
            <p>
              <strong>Distance:</strong>{' '}
              {Math.round(swipeData.distance.x)}, {Math.round(swipeData.distance.y)}
            </p>
          </>
        )
      }
    >
      <div
        {...bind}
        className="glass-panel"
        style={{
          width: '280px',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          cursor: 'pointer'
        }}
      >
        Swipe here
      </div>
    </TestLayout>
  );
};

export default SwipeTest;