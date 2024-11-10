"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import uploadFiles from "@/lib/api/asset/uploadFiles";
import createReply from "@/lib/api/reply/createReply";
import getUserDetail from "@/lib/api/user/getUserDetail";
import { FILE_SIZE_LIMIT } from "@/lib/utils";

interface ReplyFormProps {
  onClose: () => void;
  setReplies: Dispatch<SetStateAction<Reply[]>>;
  setUserDetails: Dispatch<SetStateAction<User[]>>;
  setVoteCounts: Dispatch<SetStateAction<VoteCounts[]>>;
  setVoteStatuses: Dispatch<SetStateAction<number[]>>;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  onClose,
  setReplies,
  setUserDetails,
  setVoteCounts,
  setVoteStatuses,
}: ReplyFormProps) => {
  const { slug } = useParams();
  const { data: session } = useSession();
  const [body, setBody] = useState("");
  const [assets, setAssets] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > FILE_SIZE_LIMIT * 1024 * 1024
      );

      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles
          .map((file) => `"${file.name}"`)
          .join(", ");
        setError(
          `ไฟล์ดังต่อไปนี้มีขนาดเกิน ${FILE_SIZE_LIMIT} MB : ${fileNames}`
        );
        setAssets([]);
      } else {
        setError("");
        setAssets(selectedFiles);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = session?.user.accessToken as string;

      // Upload files and get their URLs
      const assetUrls: string[] = [];
      if (assets.length > 0) {
        const responses = await uploadFiles(token, assets);
        assetUrls.push(...responses.map((res) => res.responseObject.assetUrl));
      }

      // Prepare data according to ReplyRequest interface
      const replyData: ReplyRequest = {
        text: body,
        assetUrls,
      };

      // Call createReply with threadId and authorId from session
      if (typeof slug === "string") {
        const responseReply = await createReply(token, slug, replyData);
        const newReply = responseReply.newReply;

        // Get User Profile
        const userProfile = await getUserDetail(token, newReply.userId);
        setReplies((prevReplies) => [newReply, ...prevReplies]);
        setUserDetails((prevUsers) => [userProfile, ...prevUsers]);
        setVoteCounts((prevCounts) => [
          {
            upVotes: 0,
            downVotes: 0,
            netVotes: 0,
          },
          ...prevCounts,
        ]);
        setVoteStatuses((prevStatuses) => [0, ...prevStatuses]);
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
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            {/* Display error message */}
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
        <Button type="submit" className="bg-primary" disabled={error != ""}>
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            "ตอบกลับ"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ReplyForm;
