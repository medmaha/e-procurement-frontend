"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { MessageCircle } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

type Props = {
	disabled: boolean;
	isRejected: boolean;
	defaultValue?: string;
	updateData: (value: string) => void;
};

export default function Comment(props: Props) {
	const [isOpen, toggleOpen] = useState(false);
	const [comment, setComment] = useState(props.defaultValue);

	async function submitComment() {
		if (!comment || comment?.length < 5) {
			toast.error("Comment must be more than 5 characters", {
				toastId: "comment-error",
				autoClose: false,
				position: "top-center",
			});
			return;
		}
		toast.done("comment-error");
		props.updateData(comment);
		toggleOpen(false);
	}

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={(opened) => {
				if (props.disabled) return;

				props.updateData(comment || "")

				if (!opened) {
					if ((comment && comment.length >= 5) === false) {
						setComment(undefined);
					}
					toast.done("comment-error");
				}
				toggleOpen(opened);
			}}
		>
			<AlertDialogTrigger asChild disabled={props.disabled || props.isRejected}>
				<Button
					size="icon-sm"
					title="Add Comment"
					variant={"secondary"}
					disabled={props.disabled || props.isRejected}
					className={`rounded-full bg-secondary hover:border ${props.isRejected && "text-destructive border-destructive"} ${
						comment ? "text-success" : "hover:bg-card"
					}`}
				>
					<MessageCircle />
					<span className="sr-only">Add Comment</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="max-h-[95svh] overflow-hidden overflow-y-auto">
				<AlertDialogHeader className="border-b pb-2">
					<AlertDialogTitle className="text-xl font-semibold">
						Evaluation Comment/Remarks
					</AlertDialogTitle>
					<AlertDialogDescription>
						Add an evaluation comment/remarks for this quotation
					</AlertDialogDescription>
				</AlertDialogHeader>
				{isOpen && (
					<div className="mt-4 w-full block">
						<div className="grid gap-2 pb-4">
							<Label>
								Comment/Remarks
								<span title="This field cannot be blank" className="pl-2 link">
									*
								</span>
							</Label>
							<TextArea
								disabled={props.disabled}
								value={comment!}
								setComment={setComment}
							/>
						</div>
						<AlertDialogFooter className="mt-2">
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							{!props.disabled && (
								<Button className="px-5 font-semibold" onClick={submitComment}>
									Save
								</Button>
							)}
						</AlertDialogFooter>
					</div>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
}

type TextareaProps = {
	disabled: boolean;
	value: string;
	setComment: (comment: string) => void;
};

function TextArea(props: TextareaProps) {
	return (
		<Textarea
			required
			disabled={props.disabled}
			defaultValue={props.value}
			minLength={5}
			className="max-h-[300px] focus:border-foreground focus:ring-0"
			onBlur={(ev) => {
				const target = ev.target;
				target.classList.add(
					"invalid:border-destructive",
					"invalid:ring-offset-destructive"
				);
				if (toast.isActive("comment-error")) {
					if (target.value.length >= 5) toast.done("comment-error");
				}
			}}
			onChange={(ev) => {
				const target = ev.target;
				if (toast.isActive("comment-error")) {
					if (target.value.length >= 5) toast.done("comment-error");
				}
				props.setComment(target.value);
			}}
			placeholder="Add a comment or remarks..."
		/>
	);
}
