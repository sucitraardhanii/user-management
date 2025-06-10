"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, isTokenExpired } from "@/lib/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired()) {
      router.replace("/login");
    }
  }, []);

  return children;
}
