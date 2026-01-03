import Link from 'next/link';
import Header from '@/components/common/Header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to RENTCHAIN
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Direct rental negotiation and agreement platform
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/properties"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">List Properties</h3>
            <p className="text-gray-600">
              Property owners can easily list their rental properties
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Negotiate Directly</h3>
            <p className="text-gray-600">
              Tenants and owners negotiate prices without brokers
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Blockchain Signed</h3>
            <p className="text-gray-600">
              Agreements are signed and stored on blockchain for security
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

