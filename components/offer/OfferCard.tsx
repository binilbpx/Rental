import { Offer } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface OfferCardProps {
  offer: Offer;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: () => void;
  showActions?: boolean;
}

export default function OfferCard({ 
  offer, 
  onAccept, 
  onReject, 
  onCounter,
  showActions = false 
}: OfferCardProps) {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    COUNTERED: 'bg-blue-100 text-blue-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-lg font-semibold">${offer.amount}/month</p>
          <p className="text-sm text-gray-500">
            {new Date(offer.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[offer.status]}`}>
          {offer.status}
        </span>
      </div>
      
      {offer.message && (
        <p className="text-gray-700 mb-4">{offer.message}</p>
      )}

      {showActions && offer.status === 'PENDING' && (
        <div className="flex gap-2 mt-4">
          {onAccept && (
            <Button onClick={onAccept} variant="primary">
              Accept
            </Button>
          )}
          {onCounter && (
            <Button onClick={onCounter} variant="secondary">
              Counter
            </Button>
          )}
          {onReject && (
            <Button onClick={onReject} variant="danger">
              Reject
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

