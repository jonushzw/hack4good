// In the AddVoucher component
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/clerk-react";

export default function AddVoucher() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [userId, setUserId] = useState('');
    const [balance, setBalance] = useState('');
    const [currentBalance, setCurrentBalance] = useState<number | null>(null);
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
        const userId = params.get('userId');
        if (userId) {
            setUserId(userId);
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
        if (!userId) return;

        async function fetchVoucherBalance() {
            setLoading(true);
            setError(null);
            const { data, error } = await client
                .from('vouchers')
                .select('balance')
                .eq('user_id', userId)
                .single();
            if (error) {
                setError('Error fetching voucher balance');
                setCurrentBalance(null);
            } else {
                setCurrentBalance(data?.balance ?? null);
            }
            setLoading(false);
        }

        fetchVoucherBalance();
    }, [userId]);

    async function checkUserExists(userId: string) {
        const { data, error } = await client
            .from('vouchers')
            .select('balance')
            .eq('user_id', userId)
            .single();
        return !error && data;
    }

    async function insertVoucher(userId: string, balance: number) {
        try {
            const { data, error } = await client
                .from('vouchers')
                .insert({ user_id: userId, balance: balance });
            if (error) {
                console.error('Insert Error:', error);
                throw new Error('Error inserting new voucher balance');
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

    async function updateVoucher(userId: string, balance: number) {
        const { error } = await client
            .from('vouchers')
            .update({ balance })
            .eq('user_id', userId);
        if (error) {
            throw new Error('Error updating voucher balance');
        }
    }

    async function handleVoucherBalance(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userExists = await checkUserExists(userId);
            if (userExists) {
                await updateVoucher(userId, parseFloat(balance));
            } else {
                await insertVoucher(userId, parseFloat(balance));
            }
            setCurrentBalance(parseFloat(balance));
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
            <h1 style={{ textAlign: 'center', color: '#333' }}>Add Voucher</h1>
            <form onSubmit={handleVoucherBalance} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="userId" style={{ fontWeight: 'bold', color: '#555' }}>User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px' }}
                    />
                </div>
                <div>
                    <label htmlFor="balance" style={{ fontWeight: 'bold', color: '#555' }}>Balance:</label>
                    <input
                        type="number"
                        id="balance"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        required
                        style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', ...(loading && { backgroundColor: '#ccc' }) }}>Update Balance</button>
            </form>
            {loading && <p style={{ textAlign: 'center', color: 'green' }}>Loading...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
            {currentBalance !== null && (
                <p style={{ textAlign: 'center', color: 'green' }}>Current Balance: {currentBalance}</p>
            )}
        </div>
    );
}