import Link from 'next/link';
import { Agreement, Property } from '@/types';

interface AgreementTileProps {
  agreement: Agreement;
  property?: Property;
}

export default function AgreementTile({ agreement, property }: AgreementTileProps) {
  return (
    <Link href={`/agreements/${agreement.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Agreement #{agreement.id}</h3>
            <p className="text-xl font-bold text-gray-900">${agreement.finalAmount}<span className="text-sm font-normal text-gray-600">/mo</span></p>
            {property && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{property.title}</p>
            )}
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            agreement.status === 'SIGNED' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {agreement.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {new Date(agreement.createdAt).toLocaleDateString()}
          </p>
          {agreement.status === 'SIGNED' && (
            <span className="text-xs text-green-600 font-medium">✓ Signed</span>
          )}
        </div>
      </div>
    </Link>
  );
}

