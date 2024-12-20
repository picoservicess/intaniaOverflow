"use client";

import { Upload, X } from "lucide-react";

import { useRef, useState } from "react";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import uploadFiles from "@/lib/api/asset/uploadFiles";
import updateThread from "@/lib/api/thread/updateThread";

interface UpdateThreadFormProps {
	onClose: () => void;
	threadToUpdate: Thread;
}

const UpdateThreadForm: React.FC<UpdateThreadFormProps> = ({ onClose, threadToUpdate }) => {
	const { data: session } = useSession();
	const [title, setTitle] = useState(threadToUpdate.title);
	const [body, setBody] = useState(threadToUpdate.body);
	const [existingAssets, setExistingAssets] = useState<string[]>(threadToUpdate.assetUrls);
	const [assets, setAssets] = useState<File[]>([]);
	const [tags, setTags] = useState<string[]>(threadToUpdate.tags);
	const [isAnonymous, setIsAnonymous] = useState(threadToUpdate.isAnonymous);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setAssets(Array.from(e.target.files));
		}
	};

	const removeExistingFile = (urlToRemove: string) => {
		setExistingAssets(existingAssets.filter((url) => url !== urlToRemove));
	};

	const removeNewFile = (indexToRemove: number) => {
		setAssets(assets.filter((_, index) => index !== indexToRemove));

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const getFileName = (url: string) => {
		const fileName = url.split("/").pop()!;
		const decodedFileName = decodeURIComponent(fileName);
		return decodedFileName.split("_").slice(1).join("_");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		if (!session?.user?.accessToken) {
			console.error("User is not authenticated");
			setLoading(false);
			return;
		}

		try {
			const assetUrls: string[] = [];
			if (assets.length > 0) {
				// Upload files if there are assets
				const responses = await uploadFiles(session?.user?.accessToken, assets);
				assetUrls.push(...responses.map((res) => res.responseObject.assetUrl));
			}

			const updatedThread: UpdateThreadRequest = {
				title,
				body,
				assetUrls: [...existingAssets, ...assetUrls],
				tags,
				isAnonymous,
			};

			// Call the update thread API
			await updateThread(session?.user?.accessToken, threadToUpdate.threadId, updatedThread);
			onClose(); // Close the form after submission
		} catch (error) {
			console.error("Error updating thread:", error);
		} finally {
			setLoading(false); // Set loading to false once the process is complete
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

			{existingAssets.length > 0 && (
				<div className="space-y-4">
					<Label>ไฟล์ปัจจุบัน</Label>
					<div className="flex flex-wrap gap-2">
						{existingAssets.map((url) => (
							<div key={url} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
								<span className="text-sm">{getFileName(url)}</span>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="p-1 h-6 w-6"
									onClick={() => removeExistingFile(url)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="space-y-4">
				<Label htmlFor="assets">อัพโหลดไฟล์ใหม่</Label>

				<div className="space-y-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						className="w-full"
					>
						<Upload className="mr-2 h-4 w-4" /> แนบไฟล์
					</Button>
					<Input
						ref={fileInputRef}
						id="assets"
						type="file"
						onChange={handleFileChange}
						multiple
						className="hidden"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					{assets.map((file, index) => (
						<div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
							<span className="text-sm">{file.name}</span>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="p-1 h-6 w-6"
								onClick={() => removeNewFile(index)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
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
				<Button type="submit" className="bg-primary">
					{loading ? (
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
					) : (
						"อัปเดต"
					)}
				</Button>
			</div>
		</form>
	);
};

export default UpdateThreadForm;
