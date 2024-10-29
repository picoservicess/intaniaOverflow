"use client";

import { Pencil } from "lucide-react";
import Modal from "./modal";
import ProfileForm from "./profileForm";
import { useState } from "react";

export default function EditProfileButton() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Button className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-slate-500">
        <Pencil size={16} />
      </Modal.Button>
      <Modal.Content title="แก้ไขโปรไฟล์">
        <ProfileForm onClose={() => setOpen(false)} />
      </Modal.Content>
    </Modal>
  );
}
