"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/token";


export const useSessionGuard = () => {
  const { token, handleAuthError } = useAuth();
  const isChecking = useRef(false);

  useEffect(() => {
    if (!token) return;

    const checkSession = async () => {
      // Prevent overlapping checks
      if (isChecking.current) return;
      isChecking.current = true;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) {
          handleAuthError();
          return;
        }

        const json = await res.json();

        if (
          !json.status &&
          ["token", "unauthenticated", "unauthorized", "expired"].some((phrase) =>
            json.message?.toLowerCase().includes(phrase)
          )
        ) {
          handleAuthError();
        }
      } catch {
        // Network error — don't redirect, user might just be offline
      } finally {
        isChecking.current = false;
      }
    };

    window.addEventListener("focus", checkSession);
    return () => window.removeEventListener("focus", checkSession);
  }, [token, handleAuthError]);
};