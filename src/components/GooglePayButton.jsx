/**
 * GooglePayButton — initiates a Google Pay / UPI payment flow for wallet top-up.
 *
 * When VITE_GOOGLE_PAY_MERCHANT_ID is set in .env, attempts real Google Pay API.
 * Falls back to a styled UPI button in stub environments.
 *
 * @param {{ amount: number, onSuccess: Function }} props
 */
import { useCallback, useState } from "react";
import { trackEvent } from "../services/analytics";

function GooglePayButton({ amount = 500, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const merchantId = import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID ?? null;

  const handlePay = useCallback(async () => {
    setProcessing(true);
    trackEvent("wallet_topup_initiated", { amount, method: "google_pay" });

    if (merchantId && window.google?.payments?.api) {
      // Real Google Pay integration entry point
      // See: https://developers.google.com/pay/api/web/guides/tutorial
      try {
        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: "TEST",
        });
        const paymentDataRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["VISA", "MASTERCARD"],
              },
              tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                parameters: { gateway: "example", gatewayMerchantId: merchantId },
              },
            },
          ],
          merchantInfo: { merchantId, merchantName: "Smart Event Companion" },
          transactionInfo: { totalPriceStatus: "FINAL", totalPrice: String(amount), currencyCode: "INR" },
        };
        await paymentsClient.loadPaymentData(paymentDataRequest);
        onSuccess?.("Google Pay", amount);
        trackEvent("wallet_topup_success", { amount, method: "google_pay" });
      } catch {
        // User cancelled or not available — silent fallback
      }
    } else {
      // Stub: simulate a 1-second processing delay then succeed
      await new Promise((r) => setTimeout(r, 1000));
      onSuccess?.("Google Pay", amount);
      trackEvent("wallet_topup_success", { amount, method: "stub" });
    }

    setProcessing(false);
  }, [amount, merchantId, onSuccess]);

  return (
    <button
      id="btn-google-pay"
      className="btn-primary"
      onClick={handlePay}
      disabled={processing}
      aria-label={`Pay ₹${amount} with Google Pay`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
        opacity: processing ? 0.7 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <span style={{ fontSize: "1.2rem" }}>G</span>
      {processing ? "Processing…" : `Pay ₹${amount} with GPay`}
    </button>
  );
}

export default GooglePayButton;
