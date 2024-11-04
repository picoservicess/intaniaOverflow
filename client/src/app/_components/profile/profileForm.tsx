"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

import updateUserProfile from "@/lib/api/updateUserProfile";
import uploadFiles from "@/lib/api/uploadFiles"; // Updated import
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  onClose: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onClose }) => {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let profileImageUrl: string | undefined;

      if (picture) {
        const [response] = await uploadFiles(session?.user?.accessToken, [picture]);
        profileImageUrl = response?.responseObject.assetUrl;
      }

      await updateUserProfile(session?.user.accessToken, displayName, profileImageUrl);

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardContent className="p-0">
        <div className="grid gap-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={previewUrl || ""}
                alt="Profile preview"
                className="size-full rounded-[inherit] object-cover"
              />
              <AvatarFallback>
                {displayName ? displayName[0].toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>

            <div className="w-full">
              <Label
                htmlFor="picture"
                className="block text-sm font-medium mb-2"
              >
                อัพโหลดรูปโปรไฟล์
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/jpeg, image/png"
                className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                onChange={handleFileChange}
                multiple={false}
              />
              {picture && (
                <p className="mt-2 text-sm text-muted-foreground">
                  ไฟล์ที่เลือก: {picture.name}
                </p>
              )}
            </div>
          </div>

          {/* Display Name Input */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              ชื่อที่ใช้แสดง
            </Label>
            <Input
              id="displayName"
              type="text"
              placeholder="ใส่ชื่อที่ต้องการแสดง"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>

      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild>
          <Button variant="outline" type="button" className="w-full sm:w-auto">
            ยกเลิก
          </Button>
        </DialogClose>
        <Button type="submit" className="bg-primary">
          {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : "ยืนยัน"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProfileForm;
