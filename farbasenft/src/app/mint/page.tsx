'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseAbi } from 'viem';
import { AppLayout } from '@/components/AppLayout';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}` | undefined;
const CONTRACT_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function mintTo(address to, string memory tokenURI) public returns (uint256)'
]);

export default function MintPage() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [attributesText, setAttributesText] = useState('');
  const [status, setStatus] = useState('idle');
  const [uploadProvider, setUploadProvider] = useState('pinata');
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    
    // Create preview URL
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  }

  async function uploadToServer() {
    if (!file) throw new Error('No file selected');
    const form = new FormData();
    form.append('file', file);
    form.append('name', name);
    form.append('description', description);
    form.append('attributes', attributesText);

    setStatus('Uploading media to server...');
    const res = await fetch(`/api/upload/${uploadProvider}`, { method: 'POST', body: form });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Upload failed');
    return json;
  }

  async function handleMint() {
    if (!address) {
      setStatus('Error: Please connect your wallet first');
      return;
    }
    
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.includes('your_') || CONTRACT_ADDRESS === '0xREPLACE') {
      setStatus('Error: NFT contract address not configured. Please set NEXT_PUBLIC_NFT_CONTRACT_ADDRESS in .env.local');
      return;
    }
    
    try {
      setStatus('Uploading & pinning...');
      const upload = await uploadToServer();
      setStatus('Minting on-chain...');
      const tokenURI = upload.tokenURI;
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS!,
        abi: CONTRACT_ABI,
        functionName: 'mintTo',
        args: [address, tokenURI],
      });
      
      setStatus('Transaction sent: ' + hash);
      setStatus('Mint confirmed — tokenURI: ' + tokenURI);
    } catch (e: any) {
      console.error(e);
      setStatus('Error: ' + (e.message || e.toString()));
    }
  }

  function handleReset() {
    setFile(null);
    setFilePreview(null);
    setName('');
    setDescription('');
    setAttributesText('');
    setStatus('idle');
    if (fileRef.current) fileRef.current.value = '';
  }

  if (!mounted) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400">Loading...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <header>
          <h1 className="text-3xl font-bold text-white">Mint NFT</h1>
          <p className="mt-2 text-slate-300">Upload your artwork and mint it as an NFT</p>
        </header>

        <section className="space-y-6 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              IPFS Provider
            </label>
            <select 
              value={uploadProvider} 
              onChange={e => setUploadProvider(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
            >
              <option value="pinata">Pinata</option>
              <option value="infura">Infura</option>
              <option value="filebase">Filebase</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Artwork File
            </label>
            <input 
              ref={fileRef}
              type="file" 
              onChange={handleFile}
              accept="image/*,video/*,audio/*"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-400"
            />
            {file && (
              <p className="text-xs text-slate-400">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            )}
            
            {/* Image Preview */}
            {filePreview && file?.type.startsWith('image/') && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="h-auto w-full max-w-md object-contain"
                />
              </div>
            )}
            
            {/* Video Preview */}
            {filePreview && file?.type.startsWith('video/') && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <video 
                  src={filePreview} 
                  controls 
                  className="h-auto w-full max-w-md"
                />
              </div>
            )}
            
            {/* Audio Preview */}
            {filePreview && file?.type.startsWith('audio/') && (
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950 p-4">
                <audio 
                  src={filePreview} 
                  controls 
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              NFT Name
            </label>
            <input 
              placeholder="My Awesome NFT" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Description
            </label>
            <textarea 
              placeholder="Describe your NFT..." 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          {/* Attributes */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Attributes (Optional JSON)
            </label>
            <textarea 
              placeholder='[{"trait_type":"Rarity","value":"Epic"}]' 
              value={attributesText} 
              onChange={e => setAttributesText(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={handleMint}
              disabled={!address || !file || !name || status.includes('Uploading') || status.includes('Minting')}
              className="flex-1 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {status.includes('Uploading') || status.includes('Minting') ? 'Processing...' : 'Upload & Mint'}
            </button>
            <button 
              onClick={handleReset}
              className="rounded-xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-slate-800"
            >
              Reset
            </button>
          </div>

          {/* Status */}
          {status !== 'idle' && (
            <div className={`rounded-xl border p-4 ${
              status.includes('Error') 
                ? 'border-red-400/30 bg-red-500/10' 
                : status.includes('confirmed')
                ? 'border-emerald-400/30 bg-emerald-500/10'
                : 'border-sky-400/30 bg-sky-500/10'
            }`}>
              <p className={`text-sm ${
                status.includes('Error')
                  ? 'text-red-200'
                  : status.includes('confirmed')
                  ? 'text-emerald-200'
                  : 'text-sky-200'
              }`}>
                {status}
              </p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
