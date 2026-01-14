import React from 'react';
import './Button.css';

function Button({ onClick, disabled, loading, children, className = '', type = 'button' }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`btn-wrapper ${className}`}
      style={{
        '--dot-size': '8px',
        '--line-weight': '1px',
        '--line-distance': '0.8rem 1rem',
        '--animation-speed': '0.35s',
        '--grid-color': '#3b82f644'
      }}
    >
      <div className="line horizontal top"></div>
      <div className="line vertical right"></div>
      <div className="line horizontal bottom"></div>
      <div className="line vertical left"></div>

      <div className="dot top left"></div>
      <div className="dot top right"></div>
      <div className="dot bottom right"></div>
      <div className="dot bottom left"></div>

      <div className="btn">
        <span className="btn-text">{loading ? 'Processing...' : children}</span>
      </div>
    </button>
  );
}

export default Button;
   