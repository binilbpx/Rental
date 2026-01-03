import Link from 'next/link';
import { Agreement } from '@/types';
import Card from '@/components/common/Card';

interface AgreementCardProps {
  agreement: Agreement;
}

export default function AgreementCard({ agreement }: AgreementCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/agreements/${agreement.id}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">Agreement #{agreement.id}</h3>
            <p className="text-gray-600">Final Amount: ${agreement.finalAmount}/month</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            agreement.status === 'SIGNED' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {agreement.status}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">
          Created: {new Date(agreement.createdAt).toLocaleDateString()}
        </p>
        
        {agreement.status === 'SIGNED' && (
          <div className="mt-4 space-y-2">
            {agreement.ipfsHash && (
              <p className="text-sm">
                <span className="font-medium">IPFS Hash:</span>{' '}
                <span className="text-blue-600 break-all">{agreement.ipfsHash}</span>
              </p>
            )}
            {agreement.txHash && (
              <p className="text-sm">
                <span className="font-medium">Transaction:</span>{' '}
                <span className="text-blue-600 break-all">{agreement.txHash}</span>
              </p>
            )}
          </div>
        )}
      </Link>
    </Card>
  );
}

