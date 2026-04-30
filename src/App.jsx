import React from 'react';
import SwipeDemo from './components/SwipeDemo';
import TouchDemo from './components/TouchDemo';
import SensorDemo from './components/SensorDemo'; 
import ContactlessDemo from './components/ContactlessDemo';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="heading-xl">
          Kinetic <span className="text-gradient">UI</span>
        </h1>
        <p className="text-sub">A premium gesture-controlled interface playground</p>
      </header>

      <main className="demo-grid">
        <div className="demo-card">
          <ContactlessDemo />
        </div>
        <div className="demo-card">
          <TouchDemo />
        </div>
        <div className="demo-card">
          <SensorDemo />
        </div>
        <div className="demo-card">
          <SwipeDemo />
        </div>
      </main>
      
      <footer style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.3, fontSize: '12px' }}>
        Built with React & Kinetic UI Library
      </footer>
    </div>
  );
}

export default App;
