"use client";

import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Identity,
  Avatar,
  Name,
  Address,
  EthBalance,
} from "@coinbase/onchainkit/identity";

export function WalletControls() {
  return (
    <Wallet>
      <ConnectWallet
        disconnectedLabel="Connect Wallet"
        onConnect={() => {
          // Ensure modal stays open - prevent redirects
          console.log("Wallet connection initiated");
        }}
        className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-400 bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/50 transition hover:border-cyan-300 hover:bg-cyan-400 hover:shadow-cyan-400/60"
      >
        <Avatar className="h-5 w-5" />
        <Name className="max-w-48 truncate text-sm font-medium" />
      </ConnectWallet>

      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar className="h-10 w-10" />
          <div className="flex flex-col">
            <Name className="text-sm font-semibold" />
            {/* Hide 0x address - show username/name instead per Base guidelines */}
            {/* Address is still accessible via hasCopyAddressOnClick */}
          </div>
          <EthBalance className="text-xs text-slate-300" />
        </Identity>

        <WalletDropdownBasename className="text-sm" />

        <WalletDropdownLink
          icon="wallet"
          href="https://keys.coinbase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm"
        >
          Coinbase Smart Wallet
        </WalletDropdownLink>

        <WalletDropdownLink
          icon="wallet"
          href="https://docs.base.org/mini-apps/quickstart/create-new-miniapp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm"
        >
          Mini App Docs
        </WalletDropdownLink>

        <WalletDropdownFundLink text="Add funds" className="text-sm" />
        <WalletDropdownDisconnect text="Disconnect" className="text-sm" />
      </WalletDropdown>
    </Wallet>
  );
}
