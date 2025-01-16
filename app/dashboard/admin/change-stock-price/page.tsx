'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/clerk-react";

export default function ChangeStockPrice() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [productId, setProductId] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [currentStock, setCurrentStock] = useState<number | null>(null);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useSession();

    const isAdmin = isSignedIn && user?.publicMetadata.role === 'admin';

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    if (!isAdmin) {
        return <p>You have no access to this page.</p>;
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('productId');
        if (productId) {
            setProductId(productId);
        }
    }, []);

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
        if (!productId) return;

        async function fetchProductDetails() {
            setLoading(true);
            setError(null);
            const { data, error } = await client
                .from('products')
                .select('stock_quantity, price')
                .eq('id', productId)
                .single();
            if (error) {
                setError('Error fetching product details');
                setCurrentStock(null);
                setCurrentPrice(null);
            } else {
                setCurrentStock(data?.stock_quantity ?? null);
                setCurrentPrice(data?.price ?? null);
            }
            setLoading(false);
        }

        fetchProductDetails();
    }, [productId]);

    async function checkProductExists(productId: string) {
        const { data, error } = await client
            .from('products')
            .select('stock_quantity')
            .eq('id', productId)
            .single();
        return !error && data;
    }

    async function insertStock(productId: string, stock: number) {
        try {
            const { data, error } = await client
                .from('products')
                .insert({ id: productId, stock_quantity: stock });
            if (error) {
                console.error('Insert Error:', error);
                throw new Error('Error inserting new stock');
            }
            console.log('Insert Success:', data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }

    async function updateStock(productId: string, stock: number) {
        const { error } = await client
            .from('products')
            .update({ stock_quantity: stock })
            .eq('id', productId);
        if (error) {
            throw new Error('Error updating stock');
        }
    }

    async function updatePrice(productId: string, price: number) {
        const { error } = await client
            .from('products')
            .update({ price: price })
            .eq('id', productId);
        if (error) {
            throw new Error('Error updating price');
        }
    }

    async function handleStockUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const productExists = await checkProductExists(productId);
            if (productExists) {
                await updateStock(productId, parseFloat(stock));
            } else {
                await insertStock(productId, parseFloat(stock));
            }
            setCurrentStock(parseFloat(stock));
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }

        setLoading(false);
    }

    async function handlePriceUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await updatePrice(productId, parseFloat(price));
            setCurrentPrice(parseFloat(price));
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }

        setLoading(false);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Change Stock and Price</h1>
            <form onSubmit={handleStockUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                <div>
                    <label htmlFor="productId" style={{ fontWeight: 'bold', color: '#555' }}>Product ID:</label>
                    <input
                        type="text"
                        id="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                        style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px' }}
                    />
                </div>
                <div>
                    <label htmlFor="stock" style={{ fontWeight: 'bold', color: '#555' }}>Stock Quantity:</label>
                    <input
                        type="number"
                        id="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', ...(loading && { backgroundColor: '#ccc' }) }}>Update Stock</button>
            </form>
            <form onSubmit={handlePriceUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="price" style={{ fontWeight: 'bold', color: '#555' }}>Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', ...(loading && { backgroundColor: '#ccc' }) }}>Update Price</button>
            </form>
            {loading && <p style={{ textAlign: 'center', color: 'green' }}>Loading...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
            {currentStock !== null && (
                <p style={{ textAlign: 'center', color: 'green' }}>Current Stock: {currentStock}</p>
            )}
            {currentPrice !== null && (
                <p style={{ textAlign: 'center', color: 'green' }}>Current Price: {currentPrice}</p>
            )}
        </div>
    );
}