import { Suspense } from "react";
import { Metadata } from "next";
import SDKCapabilitiesDemo from "@/components/SDKCapabilitiesDemo";

export const metadata: Metadata = {
  title: "SDK Capabilities Demo | farbasenft",
  description: "Comprehensive Farcaster Mini App SDK feature detection and testing",
  openGraph: {
    title: "SDK Capabilities Demo | farbasenft",
    description: "Test and explore Farcaster Mini App SDK capabilities",
  },
};

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
    </div>
  );
}

export default function SDKDemoPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SDKCapabilitiesDemo />
    </Suspense>
  );
}
