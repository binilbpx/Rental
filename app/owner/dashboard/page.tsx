'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import PropertyTile from '@/components/property/PropertyTile';
import OfferTile from '@/components/offer/OfferTile';
import AgreementTile from '@/components/agreement/AgreementTile';
import StatsTile from '@/components/dashboard/StatsTile';
import { Property, Offer, Agreement, User } from '@/types';
import { useUser } from '@/contexts/UserContext';
import Button from '@/components/common/Button';
import Link from 'next/link';
import Modal from '@/components/common/Modal';

export default function OwnerDashboard() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [pendingOffers, setPendingOffers] = useState<Array<Offer & { property?: Property; tenant?: User }>>([]);
  const [agreements, setAgreements] = useState<Array<Agreement & { property?: Property }>>([]);
  const [loading, setLoading] = useState(true);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [counterAmount, setCounterAmount] = useState('');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'owner') {
      router.push('/register');
      return;
    }
    fetchDashboardData();
  }, [currentUser, router]);

  const fetchDashboardData = async () => {
    if (!currentUser) return;
    
    try {
      // Fetch properties
      const propertiesRes = await fetch(`/api/properties/owner/${currentUser.id}`);
      const propertiesData = propertiesRes.ok ? await propertiesRes.json() : { properties: [] };
      setProperties(propertiesData.properties || []);

      // Fetch all offers for owner's properties
      const allOffers: Array<Offer & { property?: Property; tenant?: User }> = [];
      for (const property of propertiesData.properties || []) {
        const offersRes = await fetch(`/api/offers/property/${property.id}`);
        if (offersRes.ok) {
          const { offers } = await offersRes.json();
          for (const offer of offers) {
            // Fetch tenant info
            const tenantRes = await fetch(`/api/users/${offer.tenantId}`);
            const tenant = tenantRes.ok ? await tenantRes.json() : null;
            allOffers.push({ ...offer, property, tenant });
          }
        }
      }
      setPendingOffers(allOffers.filter(o => o.status === 'PENDING' || o.status === 'COUNTERED'));

      // Fetch agreements
      const agreementsRes = await fetch(`/api/agreements/user/${currentUser.id}`);
      if (agreementsRes.ok) {
        const { agreements: agreementsData } = await agreementsRes.json();
        // Fetch property info for each agreement
        const agreementsWithProperties = await Promise.all(
          agreementsData.map(async (agreement: Agreement) => {
            const propertyRes = await fetch(`/api/properties/${agreement.propertyId}`);
            const property = propertyRes.ok ? await propertyRes.json() : null;
            return { ...agreement, property };
          })
        );
        setAgreements(agreementsWithProperties);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchDashboardData();
        alert('Offer accepted! Agreement created.');
      }
    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  const handleRejectOffer = async (offerId: number) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to reject offer:', error);
    }
  };

  const handleCounterOffer = async () => {
    if (!selectedOffer || !counterAmount) return;

    try {
      const response = await fetch(`/api/offers/${selectedOffer.id}/counter`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(counterAmount) }),
      });
      if (response.ok) {
        setCounterModalOpen(false);
        setSelectedOffer(null);
        setCounterAmount('');
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to counter offer:', error);
    }
  };

  if (!currentUser || currentUser.role !== 'owner') {
    return null;
  }

  const openProperties = properties.filter(p => p.status === 'OPEN');
  const agreedProperties = properties.filter(p => p.status === 'AGREED');
  const signedAgreements = agreements.filter(a => a.status === 'SIGNED');
  const readyToSignAgreements = agreements.filter(a => a.status === 'READY_TO_SIGN');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {currentUser.name}</p>
          </div>
          <Link href="/owner/properties/new">
            <Button>Create New Property</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-12">Loading dashboard...</p>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsTile 
                title="Total Properties" 
                value={properties.length} 
                icon="🏠"
                color="blue"
              />
              <StatsTile 
                title="Pending Offers" 
                value={pendingOffers.length} 
                icon="📋"
                color="yellow"
              />
              <StatsTile 
                title="Agreements" 
                value={agreements.length} 
                icon="📝"
                color="green"
              />
              <StatsTile 
                title="Signed" 
                value={signedAgreements.length} 
                icon="✓"
                color="green"
              />
            </div>

            {/* Pending Offers Section */}
            {pendingOffers.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Offers</h2>
                  <Link href="/owner/offers" className="text-sm text-gray-600 hover:text-gray-900">
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pendingOffers.slice(0, 8).map((offer) => (
                    <OfferTile
                      key={offer.id}
                      offer={offer}
                      property={offer.property}
                      tenant={offer.tenant}
                      showActions={true}
                      onAccept={() => handleAcceptOffer(offer.id)}
                      onReject={() => handleRejectOffer(offer.id)}
                      onCounter={() => {
                        setSelectedOffer(offer);
                        setCounterModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Properties Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Properties</h2>
                <Link href="/owner/properties/new" className="text-sm text-gray-600 hover:text-gray-900">
                  Create new →
                </Link>
              </div>
              {properties.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-600 mb-4">You haven't listed any properties yet</p>
                  <Link href="/owner/properties/new">
                    <Button>Create Your First Property</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {properties.map((property) => (
                    <PropertyTile key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>

            {/* Agreements Section */}
            {agreements.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Agreements</h2>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      Ready to Sign: <span className="font-medium text-gray-900">{readyToSignAgreements.length}</span>
                    </span>
                    <span className="text-gray-600">
                      Signed: <span className="font-medium text-gray-900">{signedAgreements.length}</span>
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {agreements.map((agreement) => (
                    <AgreementTile
                      key={agreement.id}
                      agreement={agreement}
                      property={agreement.property}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Properties with Agreements */}
            {agreedProperties.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties with Agreements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {agreedProperties.map((property) => (
                    <PropertyTile key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Counter Offer Modal */}
        <Modal
          isOpen={counterModalOpen}
          onClose={() => {
            setCounterModalOpen(false);
            setSelectedOffer(null);
            setCounterAmount('');
          }}
          title="Counter Offer"
        >
          {selectedOffer && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Offer</p>
                <p className="text-lg font-semibold text-gray-900">${selectedOffer.amount}/month</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Your Counter Offer ($/month) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                  placeholder="Enter counter offer amount"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCounterOffer}
                  disabled={!counterAmount || parseFloat(counterAmount) <= 0}
                  className="flex-1"
                >
                  Submit Counter Offer
                </Button>
                <Button
                  onClick={() => {
                    setCounterModalOpen(false);
                    setSelectedOffer(null);
                    setCounterAmount('');
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
