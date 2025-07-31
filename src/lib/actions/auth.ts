'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession, getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { findUserByUsername, findUserById, updateUser } from '@/lib/services/db';
import bcrypt from 'bcrypt';

export async function login(prevState: { error: string | undefined }, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await findUserByUsername(username);

  if (user && (await bcrypt.compare(password, user.password))) {
    await createSession(user.id);
    revalidatePath('/');
    redirect('/');
  }

  return { error: 'Invalid username or password.' };
}

export async function logout() {
  await deleteSession();
  revalidatePath('/');
  redirect('/login');
}

export async function changePassword(prevState: { error?: string; success?: boolean }, formData: FormData) {
  const session = await getSession();
  if (!session) {
      return { error: 'Unauthorized' };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const user = await findUserById(session.userId);

  if (!user) {
    return { error: 'User not found.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' };
  }

  if (newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await updateUser(user);

  return { success: true };
}
