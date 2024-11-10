"use client";

import { Plus } from "lucide-react";

import { SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import ThreadForm from "./threadForm";

interface CreateThreadButtonProps {
	setThread: React.Dispatch<SetStateAction<Thread[]>>;
	setUserDetails: React.Dispatch<SetStateAction<User[]>>;
	setVoteCounts: React.Dispatch<SetStateAction<VoteCounts[]>>;
	setVoteStatuses: React.Dispatch<SetStateAction<number[]>>;
	setReplyCounts: React.Dispatch<SetStateAction<number[]>>;
	setPinStatuses: React.Dispatch<SetStateAction<boolean[]>>;
}

export default function CreateThreadButton({
	setThread,
	setUserDetails,
	setVoteCounts,
	setVoteStatuses,
	setReplyCounts,
	setPinStatuses,
}: CreateThreadButtonProps) {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="default"
					className="z-50 fixed bottom-8 right-8 h-14 w-32 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600"
				>
					<div className="flex items-center justify-center gap-1 animate-pulse">
						<Plus strokeWidth={2} />
						<span>สร้างเธรด</span>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>สร้างเธรด</DialogTitle>
				</DialogHeader>
				<ThreadForm
					onClose={() => setOpen(false)}
					setThread={setThread}
					setUserDetails={setUserDetails}
					setVoteCounts={setVoteCounts}
					setVoteStatuses={setVoteStatuses}
					setReplyCounts={setReplyCounts}
					setPinStatuses={setPinStatuses}
				/>
			</DialogContent>
		</Dialog>
	);
}
