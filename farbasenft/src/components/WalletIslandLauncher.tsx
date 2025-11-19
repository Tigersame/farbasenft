"use client";

import { Suspense } from "react";
import { WalletIsland } from "@coinbase/onchainkit/wallet";

function WalletIslandContent() {
  return <WalletIsland />;
}

export function WalletIslandLauncher() {
  return (
    <Suspense fallback={null}>
      <WalletIslandContent />
    </Suspense>
  );
}
