"use client";

import { useGoogleOneTapLogin } from '@react-oauth/google';
import { exchangeGoogleCredential } from '@/lib/google-auth-client';

/**
 * Shows Google One Tap for returning users (no full OAuth consent page).
 */
export default function GoogleOneTapPrompt({ enabled, onCredential, onError }) {
  useGoogleOneTapLogin({
    disabled: !enabled,
    cancel_on_tap_outside: true,
    onSuccess: async (credentialResponse) => {
      const credential = credentialResponse?.credential;
      if (!credential) return;

      try {
        const data = await exchangeGoogleCredential(credential);
        await onCredential?.(data);
      } catch (err) {
        onError?.(err.message || 'Google sign-in failed.');
      }
    },
    onError: () => {
      // User dismissed or browser blocked prompt — not an error worth surfacing.
    },
  });

  return null;
}
