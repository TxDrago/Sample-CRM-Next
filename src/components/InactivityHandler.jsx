"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_TIMEOUT = 44 * 60 * 1000; // 44 minutes

export default function InactivityHandler() {
  const router = useRouter();
  const timerRef = useRef();

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.clear();
      document.cookie = "token=; Max-Age=0"; // Clear token
      router.push("/tenantlogin");
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    resetTimer();
    window.addEventListener("click", resetTimer);
    window.addEventListener("keydown", resetTimer);
    return () => {
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
