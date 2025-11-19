'use client';

import React from 'react';
import { WalletIntegration } from '@/components/WalletIntegration';
import { WalletBalance } from '@/components/WalletBalance';

export function WalletPanel() {
  return (
    <div className="space-y-4">
      {/* Wallet Connection */}
      <div className="flex justify-end">
        <WalletIntegration />
      </div>

      {/* Wallet Balance Display */}
      <WalletBalance />
    </div>
  );
}
