"use client";

import { useEffect, useState } from "react";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignIn() {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const ticket = searchParams.get("ticket");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticket && status === "unauthenticated") {
      signIn("ticket", {
        ticket,
        callbackUrl: "/",
        redirect: false,
      }).catch((error) => {
        console.error("Sign in error:", error);
        setError("Authentication failed. Please try again.");
      });
    } else if (!ticket) {
      router.push("/error?error=NoTicket");
    }
  }, [ticket, status, router]);

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              ลงชื่อเข้าใช้สำเร็จ
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Button
              className="w-48 bg-primary hover:bg-primary/90"
              onClick={() => router.push("/")}
            >
              กลับสู่หน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center text-red-600">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <div className="text-gray-600">กำลังเข้าสู่ระบบ...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
