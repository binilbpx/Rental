'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import PropertyCard from '@/components/property/PropertyCard';
import AgreementCard from '@/components/agreement/AgreementCard';
import { Property, Agreement } from '@/types';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

export default function TenantDashboard() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'tenant') {
      router.push('/register');
      return;
    }
    fetchProperties();
    fetchAgreements();
  }, [currentUser, router]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  if (!currentUser || currentUser.role !== 'tenant') {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Tenant Dashboard</h1>

        {agreements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">My Agreements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agreements.map((agreement) => (
                <AgreementCard key={agreement.id} agreement={agreement} />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Available Properties</h2>
            <Link
              href="/properties"
              className="text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="text-center text-gray-600">No properties available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

