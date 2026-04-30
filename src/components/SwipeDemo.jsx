import React, { useState } from 'react';
import { useSwipe } from 'react-kinetic-ui';
import { Move } from 'lucide-react';

export default function SwipeDemo() {
  const [swipeLog, setSwipeLog] = useState('Swipe inside the box');

  const bind = useSwipe(({ direction, velocity, last }) => {
    if (last) {
        setSwipeLog(`Swiped ${direction} (${velocity.toFixed(2)}px/ms)`);
        setTimeout(() => setSwipeLog('Swipe inside the box'), 2000);
    }
  }, { threshold: 30 });

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 h-full">
      <div className="text-center w-full">
        <h3 className="heading-md flex items-center justify-center gap-2 mb-2">
          <Move className="text-accent-blue" strokeWidth={1.5} /> Swipe Gestures
        </h3>
        <p className="text-sub text-sm">Quick movements to trigger actions</p>
      </div>

      <div 
        {...bind} 
        className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-col gap-4 cursor-crosshair touch-none select-none min-h-[200px]"
      >
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
           <div className="text-white/20">
              <Move size={48} />
           </div>
        </div>
        <div className="text-accent-blue font-semibold text-sm h-4">
           {swipeLog}
        </div>
      </div>
    </div>
  );
}