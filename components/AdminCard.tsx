// components/AdminCard.tsx
import React from 'react';

const AdminCard = () => {
  return (
    <div style={styles.card}>
      <h2>Admin Only Content</h2>
      <p>You are an admin.</p>
    </div>
  );
};

const styles = {
  card: {
    padding: '20px',
    margin: '20px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default AdminCard;