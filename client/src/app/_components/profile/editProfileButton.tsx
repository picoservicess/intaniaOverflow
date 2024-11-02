"use client";

import { Pencil } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ProfileForm from "./profileForm";

export default function EditProfileButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            แก้ไขโปรไฟล์
          </DialogTitle>
          <DialogDescription>อัปเดตข้อมูลส่วนตัวของคุณ</DialogDescription>
        </DialogHeader>
        <ProfileForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
