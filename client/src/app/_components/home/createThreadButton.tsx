"use client";

import { Plus } from "lucide-react";

import { SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ThreadForm from "./threadForm";

export default function CreateThreadButton({setThread}: {setThread: React.Dispatch<SetStateAction<Thread[]>>}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="z-50 fixed bottom-8 right-8 h-14 w-32 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600"
        >
          <div className="flex items-center justify-center gap-1 animate-pulse">
            <Plus strokeWidth={2} />
            <span>สร้างเธรด</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>สร้างเธรด</DialogTitle>
        </DialogHeader>
        <ThreadForm onClose={() => setOpen(false)} setThread={setThread} />
      </DialogContent>
    </Dialog>
  );
}
