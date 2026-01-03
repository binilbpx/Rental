'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';

interface ConnectWalletProps {
  onConnect: (address: string) => void;
  connectedAddress?: string;
}

export default function ConnectWallet({ onConnect, connectedAddress }: ConnectWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (connectedAddress) {
      return;
    }

    setIsConnecting(true);
    try {
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts && accounts.length > 0) {
          onConnect(accounts[0]);
        }
      } else {
        alert('Please install MetaMask to connect your wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (connectedAddress) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">
          <span className="font-medium">Connected:</span> {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
        </p>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
    </Button>
  );
}

