import React from 'react';
import '../styles/Card.css'; // Import the CSS file for CardContainer
import {Link} from 'react-router-dom';

const CardContainer = ({ title, cards }) => (
  <>
    <div className="card-top">
      <p>{title}</p>
    </div>
    <div className="cards-container">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <img src={card.imgSrc} alt={`Card ${index + 1}`} />
          <div className="card-content">
            <div>{card.topContent}</div>
            <h3>{card.title}</h3>
            <Link to="#" className="card-link" style={{padding:'10px',backgroundColor:'rgba(236, 107, 15, 0.8)',borderRadius:'10px',color:'white'}}>Book Now</Link>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default CardContainer;
