"use client";

import { useCallback } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

interface PaymentOptions {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    contact: string;
    name: string;
  };
}

/**
 * Hook to handle Razorpay payment checkout.
 * Load the Razorpay script and open the checkout modal.
 */
export function useRazorpay() {
  const loadScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const pay = useCallback(
    async (
      options: PaymentOptions,
      onSuccess: (paymentId: string) => void,
      onFailure?: (error: unknown) => void
    ) => {
      const loaded = await loadScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const rzpOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: options.amount,
        currency: options.currency,
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        prefill: options.prefill,
        theme: {
          color: "#e94560",
        },
        handler: function (response: unknown) {
          toast.success("Payment successful! 🎉");
          onSuccess(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      try {
        const rzp = new window.Razorpay(rzpOptions);
        rzp.on("payment.failed", (response: unknown) => {
          toast.error("Payment failed. Please try again.");
          onFailure?.(response.error);
        });
        rzp.open();
      } catch (error) {
        toast.error("Could not open payment window");
        onFailure?.(error);
      }
    },
    [loadScript]
  );

  return { pay };
}
