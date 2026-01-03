import Link from 'next/link';
import { Offer, Property, User } from '@/types';
import Button from '@/components/common/Button';

interface OfferTileProps {
  offer: Offer;
  property?: Property;
  tenant?: User;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: () => void;
  showActions?: boolean;
}

export default function OfferTile({ 
  offer, 
  property,
  tenant,
  onAccept, 
  onReject, 
  onCounter,
  showActions = false 
}: OfferTileProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    COUNTERED: 'bg-blue-100 text-blue-800 border-blue-200',
    ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="text-2xl font-bold text-gray-900">${offer.amount}<span className="text-sm font-normal text-gray-600">/mo</span></p>
          {property && (
            <Link href={`/properties/${property.id}`} className="text-sm font-medium text-gray-900 hover:text-gray-700 mt-1 block">
              {property.title}
            </Link>
          )}
          {tenant && (
            <p className="text-xs text-gray-600 mt-1">From: {tenant.name}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[offer.status]}`}>
          {offer.status}
        </span>
      </div>
      
      {offer.message && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{offer.message}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {new Date(offer.createdAt).toLocaleDateString()}
        </p>
        {showActions && offer.status === 'PENDING' && (
          <div className="flex gap-2">
            {onAccept && (
              <Button onClick={onAccept} variant="primary" className="text-xs px-3 py-1">
                Accept
              </Button>
            )}
            {onReject && (
              <Button onClick={onReject} variant="danger" className="text-xs px-3 py-1">
                Reject
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

