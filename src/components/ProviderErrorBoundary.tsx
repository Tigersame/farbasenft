"use client";

import { ReactNode } from "react";

/**
 * ProviderErrorBoundary - Wraps the application to handle provider initialization
 * The actual error suppression is handled by ConsoleErrorFilter component
 */
export function ProviderErrorBoundary({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
