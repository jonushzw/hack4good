'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { useUser } from "@clerk/clerk-react";

export default function ApprovePreorder() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [preorderId, setPreorderId] = useState('');
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('pending');
    const [currentStatus, setCurrentStatus] = useState<string | null>(null);
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
        if (session?.user?.id) {
            setUserId(session.user.id);
        }
    }, [session]);

    useEffect(() => {
        if (!preorderId || !userId) return;

        async function fetchPreorderStatus() {
            setLoading(true);
            setError(null);
            const { data, error } = await client
                .from('preorders')
                .select('status')
                .eq('id', preorderId)
                .eq('user_id', userId)
                .single();
            if (error) {
                setError('Error fetching preorder status');
                setCurrentStatus(null);
            } else {
                setCurrentStatus(data?.status ?? null);
            }
            setLoading(false);
        }

        fetchPreorderStatus();
    }, [preorderId, userId]);

    async function updatePreorderStatus(preorderId: string, userId: string, status: string) {
        const { error } = await client
            .from('preorders')
            .update({ status })
            .eq('id', preorderId)
            .eq('user_id', userId);
        if (error) {
            throw new Error('Error updating preorder status');
        }
    }

    async function handlePreorderStatus(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await updatePreorderStatus(preorderId, userId, status);
            setCurrentStatus(status);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }

        setLoading(false);
    }

    function getStatusColor(status: string | null) {
        switch (status) {
            case 'approved':
                return 'green';
            case 'rejected':
                return 'red';
            case 'pending':
            default:
                return 'orange';
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Approve Preorder</h1>
            <form onSubmit={handlePreorderStatus} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="preorderId" style={{ fontWeight: 'bold', color: '#555' }}>Preorder ID:</label>
                    <input
                        type="text"
                        id="preorderId"
                        value={preorderId}
                        onChange={(e) => setPreorderId(e.target.value)}
                        required
                        style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px' }}
                    />
                </div>
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
                    <label htmlFor="status" style={{ fontWeight: 'bold', color: '#555' }}>Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px' }}
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} style={{ padding: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', ...(loading && { backgroundColor: '#ccc' }) }}>Update Status</button>
            </form>
            {loading && <p style={{ textAlign: 'center', color: 'green' }}>Loading...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
            {currentStatus !== null && (
                <p style={{ textAlign: 'center', color: getStatusColor(currentStatus) }}>Current Status: {currentStatus}</p>
            )}
        </div>
    );
}