"use client";

import { Plus } from "lucide-react";
import Modal from "./modal";
import ThreadForm from "./threadForm";
import { useState } from "react";

export default function CreateThreadButton() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Button>
        <footer className="h4  rounded-full bg-slate-800 text-center py-3 fixed bottom-8 right-8 w-32 hover:bg-slate-700 active:bg-slate-600">
          <div className="text-white flex gap-1 justify-center items-center animate-pulse">
            <Plus strokeWidth={2} />
            <p className="text-white">สร้างเธรด</p>
          </div>
        </footer>
      </Modal.Button>
      <Modal.Content title="สร้างเธรด">
        <ThreadForm onClose={() => setOpen(false)} />
      </Modal.Content>
    </Modal>
  );
}
