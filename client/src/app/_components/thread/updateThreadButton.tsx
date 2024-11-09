"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UpdateThreadForm from "./updateThreadForm";
import { Pencil } from "lucide-react";

export default function UpdateThreadButton({threadToUpdate}: {threadToUpdate: Thread}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="pt-2" size={30} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            อัพเดตเธรด
          </DialogTitle>
          <DialogDescription>
            อัพเดตเนื้อหาของเธรดนี้
          </DialogDescription>
        </DialogHeader>
        <UpdateThreadForm 
            onClose={() => setOpen(false)}
            threadToUpdate={threadToUpdate}            
        />
      </DialogContent>
    </Dialog>
  );
}
