import React from 'react';
import { useSensor } from '@deekshaaa/kinetic-ui';
import { Radio } from 'lucide-react';

export default function SensorDemo() {
  const [tilt, setTilt] = React.useState({ beta: 0, gamma: 0 });

  // useSensor listens to the DeviceOrientation event
  // We use standard React state here just for showing visual tilt if motion isn't requested natively
  React.useEffect(() => {
    // For a real app using Kinetic UI, you'd bind useSensor returning a callback.
    // Example layout assumption since hook API was partially detailed:
  }, []);

  useSensor((data) => {
    // data might contain beta, gamma, alpha
    setTilt({ beta: data.beta || 0, gamma: data.gamma || 0 });
  });

  // Calculate rotations: max out at around 30 degrees
  const rotateX = Math.max(-30, Math.min(30, tilt.beta));
  const rotateY = Math.max(-30, Math.min(30, tilt.gamma));

  return (
    <div className="glass-panel p-6 flex flex-col items-center gap-6 h-full">
      <div className="text-center w-full">
        <h3 className="heading-md flex items-center justify-center gap-2 mb-2">
          <Radio className="text-accent-purple" strokeWidth={1.5} /> Sensors
        </h3>
        <p className="text-sub text-sm">Tilt device to shift perspective</p>
      </div>

      <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-8 perspective-container">
        
        {/* Dynamic tilting card based on device sensors */}
        <div 
           className="w-full aspect-video rounded-xl bg-gradient-to-tr from-purple-800 to-indigo-900 shadow-2xl flex items-center justify-center border border-white/20"
           style={{
             transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`,
             transition: 'transform 0.1s ease-out'
           }}
        >
          <div className="text-white text-lg font-bold opacity-50 flex flex-col items-center">
             <span>β: {tilt.beta.toFixed(0)}°</span>
             <span>γ: {tilt.gamma.toFixed(0)}°</span>
          </div>
        </div>

      </div>
    </div>
  );
}
