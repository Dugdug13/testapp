import React from 'react';

const TestLayout = ({ title, subtitle, children, result }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '30px'
      }}
    >
      <h1 className="heading-xl text-gradient">{title}</h1>
      <p className="text-sub">{subtitle}</p>

      {children}

      {result && (
        <div className="glass-panel" style={{ padding: '20px', width: '320px' }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default TestLayout;