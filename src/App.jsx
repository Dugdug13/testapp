import { useState } from "react";
import { useSwipe } from "kinetic-ui";

const App = () => {
  const [lastSwipe, setLastSwipe] = useState('None');
  const [velocity, setVelocity] = useState(0);

  const bind = useSwipe(({ last, direction, velocity: v }) => {
    if (last && direction) {
      setLastSwipe(direction.toUpperCase());
      setVelocity(v);
    }
  }, { threshold: 50 });

  return (
    <div className="demo-panel">
      <h2>useSwipe</h2>
      <p>Detects direction and velocity instantly. Prioritizes rapid flings over slow draws.</p>
      <div className="status-flex">
        <div className="status-badge">Direction: <strong>{lastSwipe}</strong></div>
        <div className="status-badge">Velocity: <strong>{velocity.toFixed(2)} px/ms</strong></div>
      </div>

      <div {...bind} className="interactive-box flex-center" style={{ cursor: 'pointer' }}>
        <span className="hint-text">Swipe here!</span>
      </div>

      <div className="code-box">
        {`const bind = useSwipe(({ direction, velocity, last }) => {
  if (last) console.log(direction);
}, { threshold: 50 });`}
      </div>
    </div>
  );
};

export default App;