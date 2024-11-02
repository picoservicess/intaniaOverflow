"use client";

import { Reply } from "lucide-react";

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

import ReplyForm from "./replyForm";

export default function CreateReplyButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8 h-14 gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
          <Reply strokeWidth={2} size={20} />
          <span className="font-medium">ตอบกลับ</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            เพิ่มการตอบกลับ
          </DialogTitle>
          <DialogDescription>
            แชร์ความคิดเห็นของคุณในการสนทนานี้
          </DialogDescription>
        </DialogHeader>
        <ReplyForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
