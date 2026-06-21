import React from 'react';
import { useNavigate } from 'react-router-dom';
import { imageUrl } from '../api/imageUrl';

export default function CarCard({ car }) {
  const navigate = useNavigate();
  return (
    <div className="car-card" onClick={() => navigate(`/cars/${car.id}`)}>
      <div className="car-card-image-wrap">
        {car.image
          ? <img src={imageUrl(car.image)} alt={car.model} />
          : <div className="car-card-placeholder">🚗</div>
        }
        <div className="car-card-condition">
          <span className={`badge ${car.condition}`}>
            {car.condition === 'new' ? '✨ New' : '🔧 Used'}
          </span>
        </div>
        <div className="car-card-overlay">
          <span>View Details →</span>
        </div>
      </div>
      <div className="car-card-body">
        <h3>{car.brand} {car.model}</h3>
        <div className="car-card-year">{car.year}</div>
        <div className="price">KSh {Number(car.price).toLocaleString()}</div>
        <div className="car-divider" />
        <div className="car-meta">
          <div className="car-meta-item">
            <span className="meta-icon">📍</span>
            <span>{Number(car.mileage).toLocaleString()} km</span>
          </div>
          <div className="car-meta-item">
            <span className="meta-icon">📅</span>
            <span>{car.year}</span>
          </div>
          {car.category_name && (
            <div className="car-meta-item">
              <span className="meta-icon">🏷️</span>
              <span>{car.category_name}</span>
            </div>
          )}
        </div>
        <button className="car-card-btn">View Details</button>
      </div>
    </div>
  );
}
