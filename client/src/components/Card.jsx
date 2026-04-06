import React from 'react';
import './Card.css';

const Card = ({ title, value, subtitle, icon, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {icon && <div className="card-icon">{icon}</div>}
      </div>
      <div className="card-content">
        <div className="card-value">{value}</div>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Card;
