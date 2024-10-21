"use client";

import { useState } from "react";
import Modal from "./modal";
import PrimaryButton from "./primaryButton";
import SecondaryButton from "./secondary_button";
import createReply from "@/lib/createReply";

interface ReplyFormProps {
  onClose: () => void;
}

interface Reply {
  body: string;
  assets: File[];
  authorId: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ onClose }) => {
  const [body, setBody] = useState("");
  const [assets, setAssets] = useState<File[]>([]);
  const [authorId, setAuthorId] = useState("1");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAssets(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReply: Reply = { body, assets, authorId };
    createReply({
      body: newReply.body,
      assetUrls: [],
      authorId: newReply.authorId,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 p">
        <div>
          <label htmlFor="body">เนื้อหา</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="assets">อัพโหลดไฟล์</label>
          <input id="assets" type="file" multiple onChange={handleFileChange} />
        </div>

        <div className="flex justify-end gap-5">
          <PrimaryButton text="โพส" />
          <Modal.Close>
            <SecondaryButton text="ยกเลิก" />
          </Modal.Close>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
