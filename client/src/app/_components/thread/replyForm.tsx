"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import createReply from "@/lib/api/createReply";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardContent className="p-0">
        <div className="grid w-full gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="body">เนื้อหา</Label>
            <Textarea
              id="body"
              className="min-h-[100px] resize-none"
              placeholder="พิมพ์เนื้อหาของคุณที่นี่..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="assets">อัพโหลดไฟล์</Label>
            <Input
              id="assets"
              type="file"
              multiple
              className="cursor-pointer"
              onChange={handleFileChange}
            />
            {assets.length > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                {assets.length} ไฟล์ที่เลือก
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <DialogFooter className="gap-2">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            ยกเลิก
          </Button>
        </DialogClose>
        <Button type="submit">ตอบกลับ</Button>
      </DialogFooter>
    </form>
  );
};

export default ReplyForm;
