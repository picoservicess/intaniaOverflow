"use client";

import React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CUIcon from "@/app/assets/account-link-logo-cu.svg";

const LoginPage = () => {
  const router = useRouter();
  const { status } = useSession();

  const handleChulaSSOSignIn = async () => {
    try {
      router.push(
        `https://account.it.chula.ac.th/login?serviceName=app.vercel.sci-locker&service=${process.env.BASE_URL || "http://localhost:3001"}/auth/signin`
      );
    } catch (error) {
      console.error("Error signing in with Chula SSO:", error);
    }
  };

  const handleReturnHome = () => {
    router.push("/home");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              ลงชื่อเข้าใช้สำเร็จ
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              className="w-48 bg-primary hover:bg-primary/90"
              onClick={handleReturnHome}
            >
              กลับสู่หน้าแรก
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleChulaSSOSignIn}
          >
            Connect with
            <div className="flex w-8 h-8 items-center justify-center">
              <CUIcon />
            </div>
            Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
