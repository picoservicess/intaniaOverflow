"use client";

import { useState } from "react";
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import createReply from "@/lib/api/reply/createReply";
import uploadFiles from "@/lib/api/asset/uploadFiles";

interface ReplyFormProps {
  onClose: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ onClose }) => {
  const { slug } = useParams();
  const { data: session } = useSession();
  const [body, setBody] = useState("");
  const [assets, setAssets] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAssets(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload files and get their URLs
      const assetUrls: string[] = [];
      if (assets.length > 0) {
        const responses = await uploadFiles(session?.user?.accessToken, assets);
        assetUrls.push(...responses.map((res) => res.responseObject.assetUrl));
      }

      // Prepare data according to ReplyRequest interface
      const replyData: ReplyRequest = {
        text: body,
        assetUrls,
      };

      // Call createReply with threadId and authorId from session
      if (typeof slug === 'string') {
        await createReply(session?.user?.accessToken, slug, replyData);
      } else {
        console.error("Invalid threadId:", slug);
      }

      onClose();
    } catch (error) {
      console.error("Error creating reply:", error);
    }
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
        <Button type="submit" className="bg-primary">
          {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : "ตอบกลับ"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ReplyForm;
