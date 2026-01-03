'use client';

import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function Header() {
  const { currentUser, logout } = useUser();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            RENTCHAIN
          </Link>
          
          <nav className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link
                  href={currentUser.role === 'owner' ? '/owner/dashboard' : '/tenant/dashboard'}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-700">{currentUser.name}</span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

