'use client';
import { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

export default function AddVoucher() {
    const [userId, setUserId] = useState('');
    const [balance, setBalance] = useState('');
    const [currentBalance, setCurrentBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    async function updateVoucherBalance(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await client
            .from('vouchers')
            .update({ balance: parseFloat(balance) })
            .eq('user_id', userId);
        if (error) {
            setError('Error updating voucher balance');
        } else {
            setCurrentBalance(parseFloat(balance));
        }
        setLoading(false);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Add Voucher</h1>
            <form onSubmit={updateVoucherBalance} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="userId" style={{ fontWeight: 'bold', color: '#555' }}>User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
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
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', ...(loading && { backgroundColor: '#ccc' }) }}>Update Balance</button>
            </form>
            {loading && <p style={{ textAlign: 'center', color: 'green' }}>Loading...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
            {currentBalance !== null && (
                <p style={{ textAlign: 'center', color: 'green' }}>Current Balance: {currentBalance}</p>
            )}
        </div>
    );
}