import React from 'react';
import Link from 'next/link';

interface CardProps {
    title: string;
    description: string;
    link: string;
}

const Card: React.FC<CardProps> = ({ title, description, link }) => {
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '8px' }}>
            <h3>{title}</h3>
            <p>{description}</p>
            <Link href={link} legacyBehavior>
                <a style={{ color: 'blue', textDecoration: 'underline' }}>Go to {title}</a>
            </Link>
        </div>
    );
};

export default Card;