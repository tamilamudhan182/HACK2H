/**
 * useWallet — custom hook that extracts all wallet-related state and actions
 * from the EventContext, providing a clean, memoized interface for wallet components.
 *
 * @returns {{
 *   wallet: Object,
 *   attendeeProfile: Object,
 *   addWalletFunds: Function,
 *   buyPass: Function
 * }}
 */
import { useMemo } from "react";
import { useEvent } from "../context/EventContext";

export function useWallet() {
  const { wallet, attendeeProfile, addWalletFunds, buyPass } = useEvent();

  const totalDebits = useMemo(
    () => wallet.history.filter((tx) => tx.type === "debit").reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
    [wallet.history]
  );

  const totalCredits = useMemo(
    () => wallet.history.filter((tx) => tx.type === "credit").reduce((sum, tx) => sum + tx.amount, 0),
    [wallet.history]
  );

  return { wallet, attendeeProfile, addWalletFunds, buyPass, totalDebits, totalCredits };
}
