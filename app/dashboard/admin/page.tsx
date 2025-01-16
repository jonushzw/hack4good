import Link from 'next/link';
import { createClerkClient } from '@clerk/nextjs/server';
import { currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClientSsr } from "@/app/ssr/client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
    const user = await currentUser();

    if (!user) {
        return <p>You must be logged in to access this page.</p>;
    }

    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
        return <p>You have no access to this page.</p>;
    }

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    let response;
    try {
        response = await clerkClient.users.getUserList();
    } catch (error) {
        console.error('Error fetching users:', error);
        return <p>Error fetching users.</p>;
    }

    const { data: users, totalCount } = response;

    const supabaseClient = await createClerkSupabaseClientSsr();
    const { data: vouchers, error: vouchersError } = await supabaseClient.from('vouchers').select();
    if (vouchersError) {
        console.error('Error fetching vouchers:', vouchersError);
        return <p>Error fetching vouchers.</p>;
    }

    const usersWithBalance = users.map(user => {
        const voucher = vouchers?.find((v: any) => v.user_id === user.id);
        return {
            ...user,
            balance: voucher ? voucher.balance : 'N/A',
        };
    });

    const { data: products, error: productsError } = await supabaseClient.from('products').select();
    if (productsError) {
        console.error('Error fetching products:', productsError);
        return <p>Error fetching products.</p>;
    }

    const productsWithDetails = products.map(product => ({
        ...product,
        status: product.status ? 'In Stock' : 'Out of Stock',
    }));

    const { data: tasks, error: tasksError } = await supabaseClient.from('tasks').select();
    if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        return <p>Error fetching tasks.</p>;
    }

    const tasksWithDetails = tasks.map(task => {
        const user = users.find(u => u.id === task.user_id);
        return {
            ...task,
            userName: user ? user.id : 'Unknown User',
            status: task.status ? 'Completed' : 'Incomplete',
            showAddVoucher: !!task.status,
        };
    });

    const { data: transactions, error: transactionsError } = await supabaseClient.from('transaction_history').select();
    if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        return <p>Error fetching transactions.</p>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2.5em', marginBottom: '10px' }}>Welcome, Admin</h1>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2em', marginBottom: '30px' }}>
                This is the admin page. Here you can manage your application, view users, and manage products.
            </p>
            <Tabs>
                <TabsList>
                    <TabsTrigger value="users" style={{ padding: '15px 30px', fontSize: '18px' }}>Users</TabsTrigger>
                    <TabsTrigger value="products" style={{ padding: '15px 30px', fontSize: '18px' }}>Products</TabsTrigger>
                    <TabsTrigger value="tasks" style={{ padding: '15px 30px', fontSize: '18px' }}>Tasks</TabsTrigger>
                    <TabsTrigger value="transactions" style={{ padding: '15px 30px', fontSize: '18px' }}>Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <h2 style={{ color: '#333', fontSize: '2em', marginBottom: '20px' }}>Users List</h2>
                    <p style={{fontSize: 18}}>Total Users: {totalCount}</p>
                    <Table>
                        <TableCaption>A list of all users.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Voucher Balance</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersWithBalance.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.firstName ? `${user.firstName} ${user.lastName}` : 'External Account'}</TableCell>
                                    <TableCell>{user.emailAddresses[0]?.emailAddress}</TableCell>
                                    <TableCell>{user.balance}</TableCell>
                                    <TableCell>
                                        <Link href={`/dashboard/admin/add-voucher?userId=${user.id}`}>Add Voucher</Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4}>Total</TableCell>
                                <TableCell>{totalCount}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TabsContent>
                <TabsContent value="products">
                    <h2 style={{ color: '#333', fontSize: '2em', marginBottom: '20px' }}>Products List</h2>
                    <Table>
                        <TableCaption>A list of all products.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productsWithDetails.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell>{product.status}</TableCell>
                                    <TableCell>
                                        <Link href={`/dashboard/admin/change-stock-price?productId=${product.id}`}>Change Stock or Price</Link>
                                    </TableCell>
                                </TableRow>
                            )) as React.ReactNode}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="tasks">
                    <h2 style={{ color: '#333', fontSize: '2em', marginBottom: '20px' }}>Tasks List</h2>
                    <Table>
                        <TableCaption>A list of all tasks.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>User Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasksWithDetails.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.id}</TableCell>
                                    <TableCell>{task.name}</TableCell>
                                    <TableCell>{task.userName}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                    <TableCell>
                                        {task.showAddVoucher ? (
                                            <Link href={`/dashboard/admin/add-voucher?userId=${task.user_id}`}>Add Voucher</Link>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="transactions">
                    <h2 style={{ color: '#333', fontSize: '2em', marginBottom: '20px' }}>Transactions List</h2>
                    <Table>
                        <TableCaption>A list of all transactions.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.invoice_number}>
                                    <TableCell>{transaction.invoice_number}</TableCell>
                                    <TableCell>{transaction.user_id}</TableCell>
                                    <TableCell>{transaction.status}</TableCell>
                                    <TableCell>{transaction.item_name}</TableCell>
                                    <TableCell>{transaction.time_purchased}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    );
}