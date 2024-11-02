"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">หัวข้อ</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">เนื้อหา</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-32"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assets">อัพโหลดไฟล์</Label>
        <Input
          id="assets"
          type="file"
          onChange={handleFileChange}
          multiple
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">แท็ก (คั่นด้วยคอมม่า)</Label>
        <Input
          id="tags"
          value={tags.join(",")}
          onChange={(e) => setTags(e.target.value.split(","))}
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" className="bg-primary">
          สร้าง
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
        </DialogClose>
      </div>
    </form>
  );
};

export default ThreadForm;
