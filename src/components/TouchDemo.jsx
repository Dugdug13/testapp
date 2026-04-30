import React, { useState } from 'react';
import { useDrag, useSwipe } from 'react-kinetic-ui';
import { Hand, ArrowRight, Expand } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function TouchDemo() {
  const [swipeLog, setSwipeLog] = useState('Swipe inside the box');

  // Drag State
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const springDragX = useSpring(dragX, { stiffness: 600, damping: 30 });
  const springDragY = useSpring(dragY, { stiffness: 600, damping: 30 });

  // Bind Drag Gesture
  const bindDrag = useDrag(({ offset, active }) => {
    dragX.set(offset.x);
    dragY.set(offset.y);
  });

  // Bind Swipe Gesture
  const bindSwipe = useSwipe(({ direction, velocity, last }) => {
    if (last) {
        setSwipeLog(`Swiped ${direction} (${velocity.toFixed(2)}px/ms)`);
        setTimeout(() => setSwipeLog('Swipe inside the box'), 2000);
    }
  }, { threshold: 50 });

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 h-full">
      <div className="text-center w-full">
        <h3 className="heading-md flex items-center justify-center gap-2 mb-2">
          <Hand className="text-accent-pink" strokeWidth={1.5} /> Touch Gestures
        </h3>
      </div>

      <div className="flex-1 w-full grid grid-rows-2 gap-4">
        
        {/* DRAG DEMO */}
        <div className="bg-white/5 border border-white/10 rounded-2xl relative flex items-center justify-center overflow-hidden">
           <div className="absolute top-2 left-3 text-xs text-sub md:flex hidden items-center gap-1 opacity-50"><Expand size={12}/> Drag</div>
           
           <motion.div 
             {...bindDrag}
             className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-xl cursor-grab active:cursor-grabbing border border-white/20 flex items-center justify-center pointer-events-auto z-10"
             style={{ x: springDragX, y: springDragY }}
           >
              <div className="w-6 h-1 rounded-full bg-white/50 mb-1" />
              <div className="w-6 h-1 rounded-full bg-white/50" />
           </motion.div>
        </div>

        {/* SWIPE DEMO */}
        <div 
          {...bindSwipe} 
          className="bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-col gap-2 cursor-crosshair touch-none select-none"
        >
          <ArrowRight className="text-white/20" size={32} />
          <div className="text-accent-pink font-semibold text-sm h-4">
             {swipeLog}
          </div>
        </div>

      </div>
    </div>
  );
}
