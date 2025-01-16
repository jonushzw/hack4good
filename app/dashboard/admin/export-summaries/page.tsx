'use client';

import { writeFile, utils } from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from 'react';

async function fetchData() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY) {
        throw new Error("Supabase environment variables are not defined");
    }

    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_KEY
    );

    const [usersResponse, vouchersResponse, productsResponse, tasksResponse, transactionsResponse, preordersResponse] = await Promise.all([
        supabaseClient.from('users').select(),
        supabaseClient.from('vouchers').select(),
        supabaseClient.from('products').select(),
        supabaseClient.from('tasks').select(),
        supabaseClient.from('transaction_history').select(),
        supabaseClient.from('preorders').select()
    ]);

    return {
        users: usersResponse.data,
        vouchers: vouchersResponse.data,
        products: productsResponse.data,
        tasks: tasksResponse.data,
        transactions: transactionsResponse.data,
        preorders: preordersResponse.data
    };
}

export default function ExportSummariesPage() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const isAdmin = isSignedIn && user?.publicMetadata.role === 'admin';

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    if (!isAdmin) {
        return <p>You have no access to this page.</p>;
    }

    async function exportToExcel() {
        if (!data) return;

        const workbook = utils.book_new();

        if (data.users) {
            const usersSheet = utils.json_to_sheet(data.users);
            utils.book_append_sheet(workbook, usersSheet, 'Users');
        }

        if (data.vouchers) {
            const vouchersSheet = utils.json_to_sheet(data.vouchers);
            utils.book_append_sheet(workbook, vouchersSheet, 'Vouchers');
        }

        if (data.products) {
            const productsSheet = utils.json_to_sheet(data.products);
            utils.book_append_sheet(workbook, productsSheet, 'Products');
        }

        if (data.tasks) {
            const tasksSheet = utils.json_to_sheet(data.tasks);
            utils.book_append_sheet(workbook, tasksSheet, 'Tasks');
        }

        if (data.transactions) {
            const transactionsSheet = utils.json_to_sheet(data.transactions);
            utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
        }

        if (data.preorders) {
            const preordersSheet = utils.json_to_sheet(data.preorders);
            utils.book_append_sheet(workbook, preordersSheet, 'Preorders');
        }

        writeFile(workbook, 'AdminData.xlsx');
    }

    async function handleFetchData() {
        setLoading(true);
        const fetchedData = await fetchData();
        setData(fetchedData);
        setLoading(false);
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', maxWidth: '800px', margin: '40px auto' }}>
            <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2.5em', marginBottom: '10px' }}>Export Summaries</h1>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2em', marginBottom: '30px' }}>
                Click the button below to fetch data and export it to an Excel file.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={handleFetchData} style={{ padding: '15px 30px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}>
                    {loading ? 'Fetching Data...' : 'Fetch Data'}
                </button>
                <button onClick={exportToExcel} style={{ padding: '15px 30px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }} disabled={!data}>
                    Export to Excel
                </button>
            </div>
            {!loading && !data && <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>No data to export. Please fetch data first.</p>}
        </div>
    );
}