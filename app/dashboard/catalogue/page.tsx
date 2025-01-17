'use client';
import React, { useEffect, useState } from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { CSSProperties } from "react";
import { FaTicketAlt } from "react-icons/fa";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image: string;
}

export default function TestCatalogue() {
    const [products, setProducts] = useState<Product[]>([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [vouchers, setVouchers] = useState<number | null>(null);
    const { user } = useUser();
    const { session } = useSession();

    function createClerkSupabaseClient() {
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_KEY!,
            {
                global: {
                    fetch: async (url, options: RequestInit = {}) => {
                        const clerkToken = await session?.getToken({
                            template: 'supabase',
                        });

                        const headers = new Headers(options.headers);
                        headers.set('Authorization', `Bearer ${clerkToken}`);

                        return fetch(url, {
                            ...options,
                            headers: headers as HeadersInit,
                        });
                    },
                },
            },
        );
    }

    const client = createClerkSupabaseClient();

    useEffect(() => {
        if (!user) return;

        async function loadProducts() {
            const { data, error } = await client
                .from('products')
                .select('id, name, description, price, stock_quantity');
            if (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } else {
                const productsWithImages = data.map((product: { id: number; name: string; description: string; price: number; stock_quantity: number; }) => {
                    let imageUrl = '';
                    switch (product.name) {
                        case 'Milo':
                            imageUrl = '/milo.jpg';
                            break;
                        case 'Chips':
                            imageUrl = '/chips.jpg';
                            break;
                        case 'Apple Juice':
                            imageUrl = '/applejuice.jpg';
                            break;
                        default:
                            imageUrl = '/default.jpg';
                    }
                    return { ...product, image: imageUrl };
                });
                setProducts(productsWithImages);
            }
        }

        async function loadVoucherBalance() {
            if (!user) return;
            const { data, error } = await client
                .from('vouchers')
                .select('balance')
                .eq('user_id', user.id)
                .single();
            if (error) {
                console.error('Error fetching vouchers:', error);
                setVouchers(null);
            } else {
                setVouchers(data.balance);
            }
        }

        loadProducts();
        loadVoucherBalance();
    }, [user]);

    const availableProducts = products.filter(product => product.stock_quantity > 0);
    const preOrderProducts = products.filter(product => product.stock_quantity <= 0);

    const handleButtonClick = (product: Product) => {
        setSelectedProduct(product);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setSelectedProduct(null);
    };

    const handlePurchase = async () => {
        if (!selectedProduct || vouchers === null || !user) return;

        try {
            const newVoucherBalance = vouchers - selectedProduct.price;

            if (newVoucherBalance < 0) {
                setPopupVisible(false);
                alert('You do not have enough vouchers');
                return;
            }

            if (selectedProduct.stock_quantity > 0) {
                const newStockQuantity = selectedProduct.stock_quantity - 1;

                const { error: stockError } = await client
                    .from('products')
                    .update({ stock_quantity: newStockQuantity })
                    .eq('id', selectedProduct.id);
                if (stockError) {
                    console.error('Error updating stock quantity:', stockError);
                    throw new Error('Error updating stock quantity');
                }

                setProducts(products.map(product =>
                    product.id === selectedProduct.id
                        ? { ...product, stock_quantity: newStockQuantity }
                        : product
                ));
            } else {
                const { error: preorderError } = await client
                    .from('preorders')
                    .insert({
                        user_id: user.id,
                        product_name: selectedProduct.name,
                        product_id: selectedProduct.id,
                        preorder_date: new Date().toISOString(),
                        status: 'pending',
                    });
                if (preorderError) {
                    console.error('Error inserting preorder:', preorderError);
                    throw new Error('Error inserting preorder');
                }
            }

            const { error: voucherError } = await client
                .from('vouchers')
                .update({ balance: newVoucherBalance })
                .eq('user_id', user.id);
            if (voucherError) {
                console.error('Error updating voucher balance:', voucherError);
                throw new Error('Error updating voucher balance');
            }

            const { error: transactionError } = await client
                .from('transaction_history')
                .insert({
                    user_id: user.id,
                    status: selectedProduct.stock_quantity > 0 ? 'Purchased' : 'Preorder',
                    item_name: selectedProduct.name,
                    vouchers_used: selectedProduct.price,
                });
            if (transactionError) {
                console.error('Error inserting transaction history:', transactionError);
                throw new Error('Error inserting transaction history');
            }

            setVouchers(newVoucherBalance);
            closePopup();
        } catch (err) {
            console.error('Error during purchase process:', err);
        }
    };

    function getStockColor(stock_quantity: number) {
        return stock_quantity > 0 ? '#28a745' : 'red';
    }

    return (
        <div style={styles.catalog}>
            <div style={styles.voucherBox}>
                <FaTicketAlt style={styles.icon} />
                <span style={styles.voucherText}>Vouchers Available: {vouchers !== null ? vouchers : 'Loading...'}</span>
            </div>
            <h1 style={styles.section}>Available Products</h1>
            <div style={styles.itemsGrid}>
                {availableProducts.map(product => (
                    <div key={product.id} style={styles.itemCard}>
                        <img src={product.image} alt={product.name} style={styles.itemImage} />
                        <h2 style={styles.itemName}>{product.name}</h2>
                        <p style={styles.itemDescription}>{product.description}</p>
                        <p style={styles.itemPrice}>{product.price} Voucher(s)</p>
                        <p style={{ ...styles.itemStock, color: getStockColor(product.stock_quantity) }}>
                            {product.stock_quantity > 0 ? `In Stock: ${product.stock_quantity}` : 'Out of Stock'}
                        </p>
                        <button
                            style={product.stock_quantity > 0 ? styles.buyButton : styles.preOrderButton}
                            onClick={() => handleButtonClick(product)}
                        >
                            {product.stock_quantity > 0 ? 'Buy Now' : 'Pre-Order'}
                        </button>
                    </div>
                ))}
            </div>

            <div style={styles.spacer}></div>

            <h1 style={styles.section}>Pre-Order</h1>
            <div style={styles.itemsGrid}>
                {preOrderProducts.map(product => (
                    <div key={product.id} style={styles.itemCard}>
                        <img src={product.image} alt={product.name} style={styles.itemImage} />
                        <h2 style={styles.itemName}>{product.name}</h2>
                        <p style={styles.itemDescription}>{product.description}</p>
                        <p style={styles.itemPrice}>{product.price} Voucher(s)</p>
                        <p style={{ ...styles.itemStock, color: getStockColor(product.stock_quantity) }}>
                            {product.stock_quantity > 0 ? `In Stock: ${product.stock_quantity}` : 'Out of Stock'}
                        </p>
                        <button
                            style={product.stock_quantity > 0 ? styles.buyButton : styles.preOrderButton}
                            onClick={() => handleButtonClick(product)}
                        >
                            {product.stock_quantity > 0 ? 'Buy Now' : 'Pre-Order'}
                        </button>
                    </div>
                ))}
            </div>

            {popupVisible && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popup}>
                        <h2>{selectedProduct?.name}</h2>
                        <p>{selectedProduct?.description}</p>
                        <p>Price: ${selectedProduct?.price}</p>
                        <div style={styles.buttonContainer}>
                            <button style={styles.closeButton} onClick={closePopup}>Cancel</button>
                            <button style={styles.buyButton} onClick={handlePurchase}>Confirm</button>
                        </div>
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
    voucherBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        textAlign: 'center',
    },
    voucherText: {
        fontSize: '20px',
    },
    section: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
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
        height: '450px',
        display: 'flex',
        flexDirection: 'column' as 'column', // Ensure type compatibility
        justifyContent: 'space-between',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
    },
    itemCardHover: {
        transform: 'scale(1.05)',
    },
    itemImage: {
        width: '100%',
        height: 'auto',
        maxHeight: '200px',
        objectFit: 'contain',
        marginBottom: '10px',
    },
    itemName: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '10px 0',
    },
    itemDescription: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '10px',
    },
    itemPrice: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: '10px',
    },
    itemStock: {
        fontSize: '16px',
    },
    buyButton: {
        marginTop: 'auto',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        alignSelf: 'center',
    },
    preOrderButton: {
        marginTop: 'auto',
        padding: '10px 20px',
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        alignSelf: 'center',
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
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        gap: '10px', // Add gap between buttons
    },
};