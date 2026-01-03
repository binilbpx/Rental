'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import Button from '@/components/common/Button';
import { Agreement, Property, User } from '@/types';
import { useUser } from '@/contexts/UserContext';

export default function AgreementDetailsPage() {
  const params = useParams();
  const { currentUser } = useUser();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [tenant, setTenant] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchAgreement();
    }
  }, [params.id]);

  const fetchAgreement = async () => {
    try {
      const response = await fetch(`/api/agreements/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAgreement(data);
        
        // Fetch related data
        const [propRes, ownerRes, tenantRes] = await Promise.all([
          fetch(`/api/properties/${data.propertyId}`),
          fetch(`/api/users/${data.ownerId}`),
          fetch(`/api/users/${data.tenantId}`),
        ]);

        if (propRes.ok) setProperty(await propRes.json());
        if (ownerRes.ok) setOwner(await ownerRes.json());
        if (tenantRes.ok) setTenant(await tenantRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch agreement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (!agreement) return;

    setSigning(true);
    try {
      const response = await fetch(`/api/agreements/${agreement.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      if (response.ok) {
        await fetchAgreement();
        alert('Agreement signed successfully!');
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to sign agreement');
      }
    } catch (error) {
      console.error('Failed to sign agreement:', error);
      alert('Failed to sign agreement');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Agreement not found</p>
        </main>
      </div>
    );
  }

  const canSign = currentUser && 
    (currentUser.id === agreement.ownerId || currentUser.id === agreement.tenantId) &&
    agreement.status === 'READY_TO_SIGN';

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <h1 className="text-3xl font-bold mb-6">Agreement #{agreement.id}</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Property Details</h2>
              {property && (
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">{property.title}</p>
                  {property.location && <p className="text-gray-600">{property.location}</p>}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Parties</h2>
              <div className="bg-gray-50 p-4 rounded space-y-2">
                {owner && (
                  <p>
                    <span className="font-medium">Owner:</span> {owner.name}
                    {owner.walletAddress && (
                      <span className="text-sm text-gray-600 ml-2">
                        ({owner.walletAddress.slice(0, 6)}...{owner.walletAddress.slice(-4)})
                      </span>
                    )}
                  </p>
                )}
                {tenant && (
                  <p>
                    <span className="font-medium">Tenant:</span> {tenant.name}
                    {tenant.walletAddress && (
                      <span className="text-sm text-gray-600 ml-2">
                        ({tenant.walletAddress.slice(0, 6)}...{tenant.walletAddress.slice(-4)})
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Financial Terms</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-2xl font-bold text-blue-600">
                  ${agreement.finalAmount}/month
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Status</h2>
              <span className={`px-4 py-2 rounded-full ${
                agreement.status === 'SIGNED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {agreement.status}
              </span>
            </div>

            {agreement.status === 'SIGNED' && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Blockchain Details</h2>
                <div className="bg-gray-50 p-4 rounded space-y-2">
                  {agreement.ipfsHash && (
                    <p>
                      <span className="font-medium">IPFS Hash:</span>{' '}
                      <span className="text-blue-600 break-all">{agreement.ipfsHash}</span>
                    </p>
                  )}
                  {agreement.txHash && (
                    <p>
                      <span className="font-medium">Transaction Hash:</span>{' '}
                      <span className="text-blue-600 break-all">{agreement.txHash}</span>
                    </p>
                  )}
                  {agreement.signedAt && (
                    <p>
                      <span className="font-medium">Signed At:</span>{' '}
                      {new Date(agreement.signedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {canSign && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Sign Agreement</h2>
                <div className="space-y-4">
                  <ConnectWallet
                    onConnect={setWalletAddress}
                    connectedAddress={walletAddress}
                  />
                  {walletAddress && (
                    <Button
                      onClick={handleSignAgreement}
                      disabled={signing}
                      className="w-full"
                    >
                      {signing ? 'Signing...' : 'Sign Agreement on Blockchain'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}

