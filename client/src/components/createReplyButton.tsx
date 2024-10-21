"use client";

import Modal from "./modal";
import ReplyForm from "./replyForm";
import { useState } from "react";

export default function CreateReplyButton() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Button>
        <footer className="h4  rounded-full bg-slate-800 text-center py-3 fixed bottom-8 right-8 w-32 hover:bg-slate-700 active:bg-slate-600">
          <p className="text-white animate-pulse">+ โพสคำตอบ</p>
        </footer>
      </Modal.Button>
      <Modal.Content title="โพสคำตอบ">
        <ReplyForm onClose={() => setOpen(false)} />
      </Modal.Content>
    </Modal>
  );
}
