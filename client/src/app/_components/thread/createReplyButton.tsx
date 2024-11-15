"use client";

import { Reply } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import ReplyForm from "./replyForm";

interface CreateReplyButtonProps {
	setReplies: Dispatch<SetStateAction<Reply[]>>;
	setUserDetails: Dispatch<SetStateAction<User[]>>;
	setVoteCounts: Dispatch<SetStateAction<VoteCounts[]>>;
	setVoteStatuses: Dispatch<SetStateAction<number[]>>;
}

export default function CreateReplyButton({
	setReplies,
	setUserDetails,
	setVoteCounts,
	setVoteStatuses,
}: CreateReplyButtonProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="fixed bottom-8 right-8 h-14 gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
					<Reply strokeWidth={2} size={20} />
					<span className="font-medium">ตอบกลับ</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">เพิ่มการตอบกลับ</DialogTitle>
					<DialogDescription>แชร์ความคิดเห็นของคุณในการสนทนานี้</DialogDescription>
				</DialogHeader>
				<ReplyForm
					onClose={() => setOpen(false)}
					setReplies={setReplies}
					setUserDetails={setUserDetails}
					setVoteCounts={setVoteCounts}
					setVoteStatuses={setVoteStatuses}
				/>
			</DialogContent>
		</Dialog>
	);
}
