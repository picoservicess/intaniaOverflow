"use client";

import React from "react";
import Icon from "../../public/icon.svg";
import CreateThreadButton from "./createThreadButton";
import Link from "next/link";
import SecondaryButton from "./secondary_button";
import PrimaryButton from "./primaryButton";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b p-4 flex justify-between items-center">
      <div className="flex gap-4 justify-center items-center">
        <div className="w-8 h-8">
          <Icon />
        </div>
        <div className="text-xl">
          <span className="text-black">intania</span>
          <span className="text-[#872f2f] font-bold">Overflow</span>
        </div>
      </div>

      {session ? (
        <div className="flex gap-3">
          <CreateThreadButton />
          <Link href="/api/auth/signout">
            <SecondaryButton text="ออกจากระบบ" />
          </Link>
          <Link href="/profile">
            <div className="relative w-8 h-8">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-sm">
                  {session.user!.name![0]}
                </AvatarFallback>
              </Avatar>
              {/* Red dot */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </Link>
        </div>
      ) : (
        <Link href="/api/auth/signin">
          <PrimaryButton text="เข้าสู่ระบบ" />
        </Link>
      )}
    </header>
  );
}
