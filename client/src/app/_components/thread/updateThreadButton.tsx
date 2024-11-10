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

import UpdateThreadForm from "./updateThreadForm";

export default function UpdateThreadButton({
  threadToUpdate,
}: {
  threadToUpdate: Thread;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2 mt-1">
          <Pencil size={30} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            อัพเดตเธรด
          </DialogTitle>
          <DialogDescription>อัพเดตเนื้อหาของเธรดนี้</DialogDescription>
        </DialogHeader>
        <UpdateThreadForm
          onClose={() => setOpen(false)}
          threadToUpdate={threadToUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}
