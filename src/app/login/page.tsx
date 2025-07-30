import { LoginForm } from '@/components/auth/login-form';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/');
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <LoginForm />
    </main>
  );
}
