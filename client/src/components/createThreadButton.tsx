"use client";

import Modal from "./modal";
import ThreadForm from "./threadForm";
import { useState } from "react";

export default function CreateThreadButton() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Button className="p px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-600 active:bg-slate-500">
        <p className="text-white">สร้างเธรด</p>
      </Modal.Button>
      <Modal.Content title="สร้างเธรด">
        <ThreadForm onClose={() => setOpen(false)} />
      </Modal.Content>
    </Modal>
  );
}
