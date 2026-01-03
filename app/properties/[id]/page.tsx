'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import OfferForm from '@/components/offer/OfferForm';
import OfferCard from '@/components/offer/OfferCard';
import { Property, Offer, User } from '@/types';
import { useUser } from '@/contexts/UserContext';
import Button from '@/components/common/Button';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUser();
  const [property, setProperty] = useState<Property | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProperty();
      fetchOffers();
    }
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(`/api/offers/property/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
  };

  const handleCreateOffer = async (amount: number, message?: string) => {
    if (!currentUser || currentUser.role !== 'tenant') {
      alert('Please register as a tenant to make offers');
      return;
    }

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: parseInt(params.id as string),
          tenantId: currentUser.id,
          amount,
          message,
        }),
      });

      if (response.ok) {
        await fetchOffers();
        alert('Offer submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to submit offer');
      }
    } catch (error) {
      console.error('Failed to create offer:', error);
      alert('Failed to create offer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Property not found</p>
        </main>
      </div>
    );
  }

  const isOwner = currentUser?.role === 'owner' && currentUser.id === property.ownerId;
  const isTenant = currentUser?.role === 'tenant';

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
              
              {property.images && property.images.length > 0 && (
                <div className="mb-6">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=No+Image';
                    }}
                  />
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{property.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-600">Price:</span>
                  <p className="text-2xl font-bold text-blue-600">${property.price}/mo</p>
                </div>
                {property.location && (
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <p className="font-semibold">{property.location}</p>
                  </div>
                )}
                {property.bedrooms && (
                  <div>
                    <span className="text-gray-600">Bedrooms:</span>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <span className="text-gray-600">Bathrooms:</span>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <span className={`px-4 py-2 rounded-full ${
                  property.status === 'OPEN' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  Status: {property.status}
                </span>
              </div>
            </Card>

            {isOwner && offers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Offers</h2>
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      showActions={true}
                      onAccept={async () => {
                        try {
                          const response = await fetch(`/api/offers/${offer.id}/accept`, {
                            method: 'PUT',
                          });
                          if (response.ok) {
                            await fetchProperty();
                            await fetchOffers();
                            alert('Offer accepted! Agreement created.');
                          }
                        } catch (error) {
                          console.error('Failed to accept offer:', error);
                        }
                      }}
                      onReject={async () => {
                        try {
                          const response = await fetch(`/api/offers/${offer.id}/reject`, {
                            method: 'PUT',
                          });
                          if (response.ok) {
                            await fetchOffers();
                          }
                        } catch (error) {
                          console.error('Failed to reject offer:', error);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            {isTenant && property.status === 'OPEN' && (
              <OfferForm
                propertyPrice={property.price}
                onSubmit={handleCreateOffer}
              />
            )}

            {!currentUser && (
              <Card>
                <p className="text-gray-600 mb-4">
                  Please register as a tenant to make offers
                </p>
                <Button
                  onClick={() => router.push('/register')}
                  className="w-full"
                >
                  Register
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

