"use client";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { rejectRFQResponse } from "../actions";

type Props = {
	quote_id: ID;
	unique_id: string;
	closeDialog: () => void;
};
export default function RejectQuote(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const [reject, toggleReject] = useState(false);
	const [loading, toggleLoading] = useState(false);
	const remarkRef = useRef<HTMLTextAreaElement>(null);

	async function handleRejection() {
		const data = {
			quote_id: props.quote_id,
			remarks: remarkRef.current?.value,
		};
		toggleLoading(true);
		const response = await rejectRFQResponse(data, location.pathname);
		toggleLoading(false);
		if (response.success) {
			toast.success(response.message);
			setOpen(false);
			props.closeDialog();
			return;
		}
		toast.error(response.message);
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant={"destructive"}
					className="w-full text-lg font-semibold tracking-wide"
				>
					Reject Quotation
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-bold text-2xl">
						Confirmation
					</AlertDialogTitle>
					<div className="grid">
						<p className="text-muted-foreground">
							<b className="font-semibold">Note: </b>
							This action is immutable
						</p>
						<p className="text-muted-foreground">
							Are you sure you want to reject the Quotation
							<b className=""> {"(" + props.unique_id + ")"}</b>
						</p>
					</div>
				</AlertDialogHeader>
				{reject && (
					<div className="">
						<div className="block w-full">
							<Label className="text-lg pb-2" htmlFor="remarks">
								Remarks
							</Label>
							<Textarea
								ref={remarkRef}
								id="remarks"
								name="remarks"
								autoFocus
								className="resize-none"
								placeholder="Write a remark of your approval"
							></Textarea>
						</div>
					</div>
				)}
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button
							onClick={() => setOpen(false)}
							variant={"ghost"}
							className="font-semibold"
						>
							No Cancel
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							type="button"
							disabled={loading}
							variant={"destructive"}
							className="font-semibold"
							onClick={() => {
								if (!reject) return toggleReject(true);
								if (!remarkRef.current?.value)
									return toast.error("A remark is requires", {
										position: "bottom-center",
									});
								if (remarkRef.current?.value.length < 15)
									return toast.error("Remarks requires 15 characters minimum", {
										position: "bottom-center",
									});

								handleRejection();
							}}
						>
							{loading ? "Loading..." : !reject ? "Yes Reject" : "Reject"}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
