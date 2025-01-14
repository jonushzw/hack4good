'use client';
import { useState, useEffect } from 'react';
import { CSSProperties } from "react";

interface Item {
    id: number;
    name: string;
    image: string;
    qty: number;
}

const initialItems: Item[] = [
    { id: 1, name: 'Milo', image: '/milo.jpg', qty: 0 },
    { id: 2, name: 'Chips', image: '/chips.jpg', qty: 4 },
    { id: 3, name: 'Apple Juice', image: '/applejuice.jpg', qty: 2 },
    // Add more items as needed
];

export default function Catalog() {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [popupVisible, setPopupVisible] = useState(false);
    const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [voucherNumber, setVoucherNumber] = useState(10);

    useEffect(() => {
        // Ensure the state is consistent between server and client
        setItems(initialItems);
    }, []);

    const availableProducts = items.filter(item => item.qty > 0);
    const preOrderProducts = items.filter(item => item.qty <= 0);

    const handleButtonClick = (item: Item) => {
        setSelectedItem(item);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setSelectedItem(null);
    };

    const closeConfirmationPopup = () => {
        setConfirmationPopupVisible(false);
    };

    const confirmPurchase = () => {
        if (voucherNumber > 0) {
            setVoucherNumber(voucherNumber - 1);
            const updatedItems = items.map(item =>
                item.id === selectedItem?.id ? { ...item, qty: item.qty - 1 } : item
            );
            setItems(updatedItems);
            setPopupVisible(false);
            setConfirmationPopupVisible(true);
        } else {
            alert('No vouchers left!');
        }
        closePopup();
    };

    return (
        <div style={styles.catalog}>
            <h1 style={styles.section}>Available Products</h1>
            <div style={styles.itemsGrid}>
                {availableProducts.map(item => (
                    <div key={item.id} style={styles.itemCard}>
                        <img src={item.image} alt={item.name} style={styles.itemImage} />
                        <h2>{item.name}</h2>
                        <p>Qty: {item.qty}</p>
                        <button style={styles.buyButton} onClick={() => handleButtonClick(item)}>Buy Now</button>
                    </div>
                ))}
            </div>

            <div style={styles.spacer}></div>

            <h1 style={styles.section}>Pre-Order</h1>
            <div style={styles.itemsGrid}>
                {preOrderProducts.map(item => (
                    <div key={item.id} style={styles.itemCard}>
                        <img src={item.image} alt={item.name} style={styles.itemImage} />
                        <h2>{item.name}</h2>
                        <button style={styles.preOrderButton} onClick={() => handleButtonClick(item)}>Pre-Order Now</button>
                    </div>
                ))}
            </div>

            {popupVisible && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2>{selectedItem?.name ?? ''}</h2>
                        <img src={selectedItem?.image ?? ''} alt={selectedItem?.name ?? ''} style={styles.itemImage}/>
                        <p>Are you sure you want
                            to {selectedItem?.qty !== undefined && selectedItem.qty > 0 ? 'buy' : 'pre-order'} this
                            item?</p>
                        <div style={styles.buttonContainer}>
                            <button onClick={confirmPurchase} style={styles.confirmButton}>Confirm</button>
                            <button onClick={closePopup} style={styles.closeButton}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {confirmationPopupVisible && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2>Purchase Confirmed!</h2>
                        <p>Your remaining vouchers: {voucherNumber}</p>
                        <button onClick={closeConfirmationPopup} style={styles.closeButton}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles: { [key: string]: CSSProperties } = {
    catalog: {
        padding: '20px',
    },
    section: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    itemsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
    },
    itemCard: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'center',
        height: '300px',
        display: 'flex',
        flexDirection: 'column' as 'column', // Ensure type compatibility
        justifyContent: 'space-between',
    },
    itemImage: {
        width: '100%',
        height: 'auto',
        maxHeight: '150px',
        objectFit: 'contain',
    },
    buyButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    preOrderButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    spacer: {
        height: '50px',
    },
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    confirmButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
};