'use client';
import { useEffect, useState } from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import UserMetadata from "@/components/userMetadata";

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
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
                console.log('User ID:', user.id); // Log user ID
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

    async function createTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!user) return;
        console.log('User ID:', user.id); // Log user ID
        const { data, error } = await client.from('tasks').insert({
            name,
            user_id: user.id,
        });
        if (error) {
            console.error('Error inserting task:', error);
        } else {
            console.log('Task inserted:', data);
            window.location.reload();
        }
    }

    async function deleteTask(taskName: string) {
        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        console.log('Attempting to delete task:', taskName);
        try {
            const { data, error } = await client
                .from('tasks')
                .delete()
                .eq('name', taskName)
                .eq('user_id', user.id)
                .select(); // Ensure the response includes the deleted data

            if (error) {
                console.error('Error deleting task:', error.message);
            } else if (!data || data.length === 0) {
                console.log('No task found with the specified name.');
            } else {
                console.log('Task deleted:', data);
                // Optionally update the local state.
                setTasks((prevTasks) => prevTasks.filter((task) => task.name !== taskName));
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }


    return (
        <div>
            <h1>Tasks</h1>

            {loading && <p>Loading...</p>}

            {!loading && tasks.length > 0 && tasks.map((task: any) => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <p>{task.name}</p>
                    <button onClick={() => deleteTask(task.name)}>Delete</button>
                </div>
            ))}

            {!loading && tasks.length === 0 && <p>No tasks found</p>}

            <form onSubmit={createTask}>
                <input
                    autoFocus
                    type="text"
                    name="name"
                    placeholder="Enter new task"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <button type="submit">Add</button>
            </form>
            <UserMetadata />
        </div>
    );
}