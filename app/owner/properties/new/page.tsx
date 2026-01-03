'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import PropertyForm from '@/components/property/PropertyForm';
import { useUser } from '@/contexts/UserContext';
import { CreatePropertyDto } from '@/types';

export default function NewPropertyPage() {
  const router = useRouter();
  const { currentUser } = useUser();

  if (!currentUser || currentUser.role !== 'owner') {
    router.push('/register');
    return null;
  }

  const handleSubmit = async (data: CreatePropertyDto) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const property = await response.json();
        router.push(`/properties/${property.id}`);
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to create property');
      }
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('Failed to create property');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PropertyForm ownerId={currentUser.id} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}

