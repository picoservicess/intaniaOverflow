"use client";

import { useState } from "react";
import Modal from "./modal";
import PrimaryButton from "./primaryButton";
import SecondaryButton from "./secondary_button";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPicture(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Profile = { displayName, picture };
    // createThread({
    //   title: newThread.title,
    //   body: newThread.body,
    //   assetUrls: [],
    //   tags: newThread.tags,
    //   authorId: newThread.authorId,
    // });
    console.log(newProfile);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 p">
        <div>
          <label htmlFor="displayName">ชื่อที่ใช้แสดง</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="assets">อัพโหลดรูปโปรไฟล์</label>
          <input id="assets" type="file" onChange={handleFileChange} />
        </div>
        <div className="flex justify-end gap-5">
          <PrimaryButton text="ยืนยัน" />
          <Modal.Close>
            <SecondaryButton text="ยกเลิก" />
          </Modal.Close>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
