/**
 * useSecureQr — generates an AES-GCM encrypted QR token for wallet access.
 *
 * On first load, generates a session AES key and encrypts the QR payload.
 * The key rotates automatically every 5 minutes for forward secrecy.
 *
 * @param {{ userId: string, venueId: string, channel: string }} params
 * @returns {{ encryptedToken: string|null, plainToken: string, loading: boolean }}
 */
import { useEffect, useRef, useState } from "react";
import { generateAesKey, encryptQrPayload, exportKey } from "../utils/crypto";
import { buildQrToken } from "../utils/eventEngine";

const KEY_ROTATION_MS = 5 * 60 * 1000; // 5 minutes

export function useSecureQr({ userId, venueId, channel }) {
  const [encryptedToken, setEncryptedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const keyRef = useRef(null);
  const intervalRef = useRef(null);

  /** The deterministic plaintext QR token (fallback display). */
  const plainToken = buildQrToken({ userId, venueId, channel });

  async function rotate() {
    const key = await generateAesKey();
    keyRef.current = key;
    const encrypted = await encryptQrPayload(plainToken, key);
    setEncryptedToken(encrypted);

    // Store exported key in sessionStorage (encrypted key itself is not plaintext)
    const exported = await exportKey(key);
    sessionStorage.setItem("qr_key", exported);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      rotate().finally(() => setLoading(false));
    }, 0);

    // Rotate key every 5 minutes
    intervalRef.current = setInterval(rotate, KEY_ROTATION_MS);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, venueId, channel]);

  return { encryptedToken, plainToken, loading };
}
