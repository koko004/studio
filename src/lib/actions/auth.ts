'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function login(prevState: { error: string | undefined }, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password';

  if (username === adminUsername && password === adminPassword) {
    await createSession('admin');
    revalidatePath('/');
    redirect('/');
  }

  return { error: 'Invalid username or password. Use admin/password for demo.' };
}

export async function logout() {
  await deleteSession();
  revalidatePath('/');
  redirect('/login');
}
