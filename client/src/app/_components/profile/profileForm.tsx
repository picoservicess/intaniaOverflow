"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  onClose: () => void;
}

interface Profile {
  displayName: string;
  picture: File[];
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onClose }) => {
  const [displayName, setDisplayName] = useState("");
  const [picture, setPicture] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPicture(Array.from(e.target.files));
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Profile = { displayName, picture };
    console.log(newProfile);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardContent className="p-0">
        <div className="grid gap-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl || ""} alt="Profile preview" />
              <AvatarFallback>
                {displayName ? displayName[0].toUpperCase() : "U"}
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
                accept="image/*"
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                onChange={handleFileChange}
              />
              {picture.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  ไฟล์ที่เลือก: {picture[0].name}
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
              required
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
        <Button type="submit" className="w-full sm:w-auto">
          ยืนยัน
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProfileForm;
