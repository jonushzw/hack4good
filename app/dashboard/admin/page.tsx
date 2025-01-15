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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

    return (
        <div>
            <h1>Welcome, Admin</h1>
            <p>This is the admin page. Here you can manage your application.</p>
            <Tabs>
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <h2>Users List</h2>
                    <p>Total Users: {totalCount}</p>
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
                                        <a href={`/dashboard/admin/add-voucher?userId=${user.id}`}>Add Voucher</a>
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
                    <h2>Products List</h2>
                    <Table>
                        <TableCaption>A list of all products.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Stock Quantity</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell>{product.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    );
}