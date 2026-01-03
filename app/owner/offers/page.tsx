'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import OfferCard from '@/components/offer/OfferCard';
import { Offer, Property } from '@/types';
import { useUser } from '@/contexts/UserContext';

export default function OwnerOffersPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [offers, setOffers] = useState<Array<Offer & { property: Property }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'owner') {
      router.push('/register');
      return;
    }
    fetchOffers();
  }, [currentUser, router]);

  const fetchOffers = async () => {
    if (!currentUser) return;
    
    try {
      // Get all properties for owner
      const propertiesRes = await fetch(`/api/properties/owner/${currentUser.id}`);
      if (propertiesRes.ok) {
        const { properties } = await propertiesRes.json();
        
        // Get offers for each property
        const allOffers: Array<Offer & { property: Property }> = [];
        for (const property of properties) {
          const offersRes = await fetch(`/api/offers/property/${property.id}`);
          if (offersRes.ok) {
            const { offers } = await offersRes.json();
            for (const offer of offers) {
              allOffers.push({ ...offer, property });
            }
          }
        }
        
        setOffers(allOffers);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offerId: number) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchOffers();
        alert('Offer accepted! Agreement created.');
      }
    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  const handleReject = async (offerId: number) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchOffers();
      }
    } catch (error) {
      console.error('Failed to reject offer:', error);
    }
  };

  if (!currentUser || currentUser.role !== 'owner') {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">All Offers</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading offers...</p>
        ) : offers.length === 0 ? (
          <p className="text-center text-gray-600">No offers yet</p>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id}>
                <div className="mb-2">
                  <span className="text-sm text-gray-600">
                    Property: <strong>{offer.property.title}</strong>
                  </span>
                </div>
                <OfferCard
                  offer={offer}
                  showActions={offer.status === 'PENDING'}
                  onAccept={() => handleAccept(offer.id)}
                  onReject={() => handleReject(offer.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

