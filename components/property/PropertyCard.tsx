import Link from 'next/link';
import { Property } from '@/types';
import Card from '@/components/common/Card';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/properties/${property.id}`}>
        {property.images && property.images.length > 0 && (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover rounded-t-lg mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        )}
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{property.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">${property.price}/mo</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            property.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {property.status}
          </span>
        </div>
        {property.location && (
          <p className="text-sm text-gray-500 mt-2">📍 {property.location}</p>
        )}
        {(property.bedrooms || property.bathrooms) && (
          <p className="text-sm text-gray-500 mt-1">
            {property.bedrooms && `🛏️ ${property.bedrooms} bed`}
            {property.bedrooms && property.bathrooms && ' • '}
            {property.bathrooms && `🚿 ${property.bathrooms} bath`}
          </p>
        )}
      </Link>
    </Card>
  );
}

