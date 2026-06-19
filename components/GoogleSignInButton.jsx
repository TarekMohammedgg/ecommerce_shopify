"use client";

import { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import { exchangeGoogleCredential } from '@/lib/google-auth-client';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function GoogleSignInButton({ label, disabled, loading, onCredential, onError }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [syncing, setSyncing] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(320);
  const containerRef = useRef(null);
  const isBusy = disabled || loading || syncing;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateWidth = () => setButtonWidth(node.offsetWidth || 320);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      onError?.('Google sign-in failed.');
      return;
    }

    setSyncing(true);
    try {
      const data = await exchangeGoogleCredential(credential);
      await onCredential?.(data);
    } catch (err) {
      onError?.(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="w-full py-3.5 bg-brand-sec border border-brand-border text-brand-gray text-xs font-bold uppercase tracking-widest rounded-full cursor-not-allowed opacity-60"
      >
        Google Sign-In (not configured)
      </button>
    );
  }

  return (
    <div>
      <div ref={containerRef} className="relative w-full min-h-[46px]">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          disabled={isBusy}
          className="w-full py-3.5 bg-white border border-brand-border text-brand-navy text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 shadow-sm pointer-events-none"
        >
          {isBusy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span>{label}</span>
        </button>

        <div
          className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-full ${
            isBusy ? 'pointer-events-none opacity-60' : ''
          }`}
          aria-label={label}
        >
          <div className="opacity-[0.011]">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => onError?.('Google sign-in was cancelled or failed.')}
              theme="outline"
              size="large"
              text="continue_with"
              shape="pill"
              width={String(Math.max(buttonWidth, 200))}
              logo_alignment="left"
              useOneTap={false}
            />
          </div>
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <p className="mt-2 text-[10px] leading-relaxed text-brand-gray text-center">
          Remove &quot;unverified app&quot; warning: Google Cloud → OAuth consent screen → Publish app (Production).
          Add privacy policy URL + logo. Credentials → Authorized JavaScript origins → exact site URL (no trailing slash).
        </p>
      )}
    </div>
  );
}
