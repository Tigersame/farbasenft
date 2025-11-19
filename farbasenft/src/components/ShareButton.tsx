import { Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  description: string;
  shareUrl: string;
  message?: string;
  variant?: 'primary' | 'secondary' | 'icon';
}

/**
 * ShareButton Component
 * 
 * Reusable button to share pages on Farcaster with optional modal
 * Used across NFT detail, collection, and leaderboard pages
 * 
 * Props:
 * - title: Modal title (e.g., "Share NFT")
 * - description: Modal description/instructions
 * - shareUrl: URL to share (e.g., NFT detail page)
 * - message: Optional pre-filled share message template
 * - variant: Button style (primary, secondary, or icon-only)
 */

export function ShareButton({
  title,
  description,
  shareUrl,
  message,
  variant = 'primary',
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const buttonClasses = {
    primary:
      'inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-lg transition',
    secondary:
      'inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition',
    icon: 'p-3 rounded-full bg-cyan-500/80 text-white hover:bg-cyan-600 transition',
  };

  return (
    <>
      <button className={buttonClasses[variant]} onClick={() => setShowModal(true)}>
        <Share2 className={variant === 'icon' ? 'w-6 h-6' : 'w-5 h-5'} />
        {variant !== 'icon' && 'Share'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
            <p className="text-slate-400 mb-6">{description}</p>

            {/* Share Link */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-xs mb-2">Share Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-slate-700 text-white text-sm rounded px-3 py-2 font-mono overflow-hidden"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Optional Message Template */}
            {message && (
              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-slate-400 text-xs mb-2">Share Message</p>
                <textarea
                  defaultValue={message}
                  className="w-full bg-slate-700 text-white text-sm rounded px-3 py-2 resize-none h-20"
                />
              </div>
            )}

            {/* Instructions */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6 text-sm">
              <p className="text-slate-300 mb-3">To share on Farcaster:</p>
              <ol className="text-slate-400 space-y-2 list-decimal list-inside text-xs">
                <li>Copy the link above</li>
                <li>Open Warpcast or the Farcaster app</li>
                <li>Create a new cast</li>
                <li>Paste the link in your cast</li>
                <li>The preview will appear automatically</li>
                <li>Post your cast!</li>
              </ol>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * ShareModal Component
 * 
 * Standalone modal for sharing (if button not needed separately)
 * Used when share action is triggered by other UI elements
 */

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  shareUrl: string;
  message?: string;
  stats?: { label: string; value: string }[];
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  description,
  shareUrl,
  message,
  stats,
}: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 mb-6">{description}</p>

        {/* Stats Grid (Optional) */}
        {stats && stats.length > 0 && (
          <div className={`grid gap-3 mb-6 ${stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-cyan-400">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Share Link */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <p className="text-slate-400 text-xs mb-2">Share Link</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-slate-700 text-white text-sm rounded px-3 py-2 font-mono overflow-hidden text-xs"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded transition text-sm whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Optional Message Template */}
        {message && (
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <p className="text-slate-400 text-xs mb-2">Share Message</p>
            <textarea
              defaultValue={message}
              className="w-full bg-slate-700 text-white text-sm rounded px-3 py-2 resize-none h-20"
            />
          </div>
        )}

        {/* Instructions */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 text-sm">
          <p className="text-slate-300 mb-3 font-semibold">Quick Share Guide:</p>
          <ol className="text-slate-400 space-y-1 list-decimal list-inside text-xs">
            <li>Copy link or message above</li>
            <li>Open Warpcast</li>
            <li>Create a new cast</li>
            <li>Paste the content</li>
            <li>Preview generates automatically</li>
            <li>Post to your followers!</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
            }}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Copy Link
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
