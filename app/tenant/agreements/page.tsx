'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import AgreementCard from '@/components/agreement/AgreementCard';
import { Agreement } from '@/types';
import { useUser } from '@/contexts/UserContext';

export default function TenantAgreementsPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'tenant') {
      router.push('/register');
      return;
    }
    fetchAgreements();
  }, [currentUser, router]);

  const fetchAgreements = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`/api/agreements/user/${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setAgreements(data.agreements || []);
      }
    } catch (error) {
      console.error('Failed to fetch agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'tenant') {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Agreements</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading agreements...</p>
        ) : agreements.length === 0 ? (
          <p className="text-center text-gray-600">No agreements yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agreements.map((agreement) => (
              <AgreementCard key={agreement.id} agreement={agreement} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

