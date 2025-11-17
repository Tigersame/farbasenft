/**
 * XP System for farbasenft
 * Tracks user experience points and rewards
 */

export const XP_REWARDS = {
  DAILY_LOGIN: 100,
  SWAP: 100,
  NFT_CREATE: 100,
  NFT_SELL: 100,
  NFT_BUY: 100,
  SBT_CLAIM: 1000,
} as const;

export type XPAction = keyof typeof XP_REWARDS;

export interface XPTransaction {
  id: string;
  walletAddress: string;
  action: XPAction;
  xpAmount: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface UserXP {
  walletAddress: string;
  totalXP: number;
  level: number;
  sbtClaimed: boolean;
  lastLoginDate?: string;
  transactions: XPTransaction[];
}

/**
 * Calculate level from total XP
 * Level formula: level = floor(sqrt(totalXP / 100))
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100));
}

/**
 * Calculate XP needed for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return Math.pow(nextLevel, 2) * 100;
}

/**
 * Calculate XP progress to next level
 */
export function xpProgress(currentXP: number, currentLevel: number): {
  current: number;
  needed: number;
  percentage: number;
} {
  const needed = xpForNextLevel(currentLevel);
  const current = currentXP - (Math.pow(currentLevel, 2) * 100);
  const percentage = Math.min(100, (current / needed) * 100);
  
  return { current, needed, percentage };
}

/**
 * Check if user can claim daily login bonus
 */
export function canClaimDailyLogin(lastLoginDate?: string): boolean {
  if (!lastLoginDate) return true;
  
  const lastLogin = new Date(lastLoginDate);
  const today = new Date();
  
  // Reset at midnight
  lastLogin.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return lastLogin.getTime() < today.getTime();
}

