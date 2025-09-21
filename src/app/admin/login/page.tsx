'use client';

import { Suspense } from 'react';
import LoginForm from './login-form';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="shell py-16 text-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
