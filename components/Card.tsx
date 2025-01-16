// components/Card.tsx
import React, { CSSProperties } from 'react';

interface CardProps {
    title: string;
    description: string;
    link: string;
}

const cardStyle: CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    flex: '1 1 calc(33% - 20px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textDecoration: 'none',
    color: 'inherit',
};

const titleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
};

const descriptionStyle: CSSProperties = {
    fontSize: '14px',
    color: '#555',
    marginBottom: '20px',
};

const linkStyle: CSSProperties = {
    marginTop: 'auto',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    cursor: 'pointer',
};

const Card: React.FC<CardProps> = ({ title, description, link }) => {
    return (
        <a href={link} style={cardStyle}>
            <div>
                <div style={titleStyle}>{title}</div>
                <div style={descriptionStyle}>{description}</div>
            </div>
            <div style={linkStyle}>Go</div>
        </a>
    );
};

export default Card;