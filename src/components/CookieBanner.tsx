"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-[#111827]/95 backdrop-blur-md border-t border-[#1f2937]">
      <div className="mx-auto px-6 md:px-10 py-4 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Text */}
        <div className="flex flex-col gap-1 max-w-2xl">
          <p className="text-white text-[14px] leading-relaxed">
            We use cookies and session recording to understand how visitors use our site and improve your experience.
          </p>
          <p className="text-[#6B7280] text-[12px]">
            This includes Google Analytics and Microsoft Clarity. View our{" "}
            <Link href="/privacy" className="text-[#0F6E56] hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-[#0F6E56] hover:underline">
              Terms of Use
            </Link>
            .
          </p>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-5 py-2.5 rounded-lg border border-[#374151] text-[#9CA3AF] text-[14px] font-medium hover:border-[#4B5563] hover:text-white transition-all duration-200"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 rounded-lg bg-[#0F6E56] text-white text-[14px] font-medium hover:bg-[#0c5945] transition-all duration-200"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
