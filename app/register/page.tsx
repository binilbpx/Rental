'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types';

const registerSchema = z.object({
  role: z.enum(['owner', 'tenant']),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: { role: UserRole; name: string; email: string; password: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Registration failed');
      }

      const user = await response.json();
      setCurrentUser(user);
      
      // Redirect to appropriate dashboard
      router.push(user.role === 'owner' ? '/owner/dashboard' : '/tenant/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900">Register</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                I want to register as:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    {...register('role')}
                    type="radio"
                    value="owner"
                    className="mr-2"
                  />
                  <span>Property Owner</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('role')}
                    type="radio"
                    value="tenant"
                    className="mr-2"
                  />
                  <span>Tenant</span>
                </label>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Name *
              </label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Password *
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                placeholder="Enter your password (min 6 characters)"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

