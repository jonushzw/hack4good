'use client';
import { useEffect, useState } from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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

        async function loadTasks() {
            setLoading(true);
            if (user) {
                const { data, error } = await client
                    .from('tasks')
                    .select()
                    .eq('user_id', user.id);
                if (!error) setTasks(data);
            }
            setLoading(false);
        }

        loadTasks();
    }, [user]);

    async function updateTaskStatus(taskId: string, currentStatus: boolean) {
        if (!user) return;
        const newStatus = !currentStatus;
        const { data, error } = await client
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', taskId)
            .eq('user_id', user.id);
        if (error) {
            console.error('Error updating task status:', error);
        } else {
            setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
        }
    }

    return (
        <div>
            <h1>Tasks</h1>

            {loading && <p>Loading...</p>}

            {!loading && tasks.length > 0 && (
                <Table>
                    <TableCaption>A list of all tasks.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task ID</TableHead>
                            <TableHead>Task Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.length > 0 ? (
                            <>
                                {tasks.map((task: any) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.id}</TableCell>
                                        <TableCell>{task.name}</TableCell>
                                        <TableCell>{task.status ? 'Completed' : 'Incomplete'}</TableCell>
                                        <TableCell>
                                            <button onClick={() => updateTaskStatus(task.id, task.status)}>
                                                {task.status ? 'Mark as Incomplete' : 'Mark as Complete'}
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : null}
                    </TableBody>
                </Table>
            )}

            {!loading && tasks.length === 0 && <p>No tasks found</p>}
        </div>
    );
}