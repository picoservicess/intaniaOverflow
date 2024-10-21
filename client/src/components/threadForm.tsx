"use client";

import { useState } from "react";
import Modal from "./modal";
import PrimaryButton from "./primaryButton";
import SecondaryButton from "./secondary_button";
import createThread from "@/lib/createThread";

interface ThreadFormProps {
  onClose: () => void;
}

interface Thread {
  title: string;
  body: string;
  assets: File[];
  tags: string[];
  authorId: string;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [assets, setAssets] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [authorId, setAuthorId] = useState("1");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAssets(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newThread: Thread = { title, body, assets, tags, authorId };
    createThread({
      title: newThread.title,
      body: newThread.body,
      assetUrls: [],
      tags: newThread.tags,
      authorId: newThread.authorId,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 p">
        <div>
          <label htmlFor="title">หัวข้อ</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label htmlFor="tags">แท็ก (คั่นด้วยคอมม่า)</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            id="tags"
            type="text"
            value={tags.join(",")}
            onChange={(e) => setTags(e.target.value.split(","))}
          />
        </div>
        <div className="flex justify-end gap-5">
          <PrimaryButton text="สร้าง" />
          <Modal.Close>
            <SecondaryButton text="ยกเลิก" />
          </Modal.Close>
        </div>
      </div>
    </form>
  );
};

export default ThreadForm;
