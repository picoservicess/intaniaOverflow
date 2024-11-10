"use client";

import { SetStateAction, useState } from "react";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import uploadFiles from "@/lib/api/asset/uploadFiles";
import createThread from "@/lib/api/thread/createThread";
import getUserDetail from "@/lib/api/user/getUserDetail";
import { FILE_SIZE_LIMIT, THREADS_PER_PAGE } from "@/lib/utils";

interface ThreadFormProps {
	onClose: () => void;
	setThread: React.Dispatch<SetStateAction<Thread[]>>;
	setUserDetails: React.Dispatch<SetStateAction<User[]>>;
	setVoteCounts: React.Dispatch<SetStateAction<VoteCounts[]>>;
	setVoteStatuses: React.Dispatch<SetStateAction<number[]>>;
	setReplyCounts: React.Dispatch<SetStateAction<number[]>>;
	setPinStatuses: React.Dispatch<SetStateAction<boolean[]>>;
}

const ThreadForm: React.FC<ThreadFormProps> = ({
	onClose,
	setThread,
	setUserDetails,
	setVoteCounts,
	setVoteStatuses,
	setReplyCounts,
	setPinStatuses,
}) => {
	const { data: session } = useSession();
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [assets, setAssets] = useState<File[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);

			// Check if any file exceeds the size limit
			const oversizedFiles = selectedFiles.filter(
				(file) => file.size > FILE_SIZE_LIMIT * 1024 * 1024
			);

			if (oversizedFiles.length > 0) {
				const fileNames = oversizedFiles.map((file) => `"${file.name}"`).join(", ");
				setError(`ไฟล์ดังต่อไปนี้มีขนาดเกิน ${FILE_SIZE_LIMIT} MB: ${fileNames}`);
				setAssets([]); // Clear the files if any file is too large
			} else {
				setError("");
				setAssets(selectedFiles); // Set valid files
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		setLoading(true);
		e.preventDefault();
		try {
			// Upload Assets
			const assetUrls: string[] = [];
			if (assets.length > 0) {
				const responses = await uploadFiles(session?.user?.accessToken, assets);
				assetUrls.push(...responses.map((res) => res.responseObject.assetUrl));
			}

			// Create Thread
			const newThread: ThreadRequest = {
				title,
				body,
				assetUrls,
				tags,
				authorId: session?.user?.id,
				isAnonymous,
			};
			const responseThread = await createThread(session?.user?.accessToken, newThread);

			// Get User Profile
			const userProfile = await getUserDetail(
				session?.user.accessToken as string,
				session?.user.id
			);

			setThread((prev) => {
				const updated = [...prev];
				if (updated.length == THREADS_PER_PAGE) updated.pop();
				return [responseThread, ...updated];
			});

			setUserDetails((prev) => {
				const updated = [...prev];
				if (updated.length == THREADS_PER_PAGE) updated.pop();
				return [userProfile, ...updated];
			});

			setVoteCounts((prev) => {
				const updated = [...prev];
				if (updated.length == THREADS_PER_PAGE) updated.pop();
				return [{ upVotes: 0, downVotes: 0, netVotes: 0 }, ...updated];
			});

			setVoteStatuses((prev) => {
				const updated = [...prev];
				if (updated.length == THREADS_PER_PAGE) updated.pop();
				return [0, ...updated];
			});

			setReplyCounts((prev) => {
				const updated = [...prev];
				if (updated.length == THREADS_PER_PAGE) updated.pop();
				return [0, ...updated];
			});

			setPinStatuses((prev) => {
				const updated = [...prev];
				if (updated.length == THREADS_PER_PAGE) updated.pop();
				return [false, ...updated];
			});
		} catch (error) {
			console.error("Error creating thread:", error);
		} finally {
			onClose();
		}
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
				{error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
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

			<div className="flex items-center space-x-2">
				<input
					title="isAnonymous"
					type="checkbox"
					id="isAnonymous"
					checked={isAnonymous}
					onChange={(e) => setIsAnonymous(e.target.checked)}
				/>
				<Label htmlFor="isAnonymous">โพสต์เป็นนิรนาม</Label>
			</div>

			<div className="flex justify-end gap-4">
				<DialogClose asChild>
					<Button type="button" variant="outline" onClick={onClose}>
						ยกเลิก
					</Button>
				</DialogClose>
				<Button type="submit" className="bg-primary" disabled={error != ""}>
					{loading ? (
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
					) : (
						"สร้าง"
					)}
				</Button>
			</div>
		</form>
	);
};

export default ThreadForm;
