import Link from 'next/link';
import { Property } from '@/types';

interface PropertyTileProps {
  property: Property;
}

export default function PropertyTile({ property }: PropertyTileProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group relative overflow-hidden rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
        {property.images && property.images.length > 0 && (
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                property.status === 'OPEN' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {property.status}
              </span>
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-2">${property.price}<span className="text-sm font-normal text-gray-600">/mo</span></p>
          {property.location && (
            <p className="text-sm text-gray-600 mb-2">{property.location}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {property.bedrooms && (
              <span>{property.bedrooms} bed</span>
            )}
            {property.bathrooms && (
              <span>{property.bathrooms} bath</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

