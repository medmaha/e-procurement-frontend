"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { approvePurchaseOrder } from "../actions";

type Props = {
	order_id: ID;
	unique_id: string;
	children: ReactNode;
	clearCache?: () => void;
	closeDialog?: () => void;
};
export default function ApprovePurchaseOrder(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const [approve, toggleApprove] = useState(false);
	const [loading, toggleLoading] = useState(false);
	const remarkRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!isOpen) return () => toggleApprove(false);
	}, [isOpen]);

	async function handleApproval() {
		const data = {
			order_id: props.order_id,
			remarks: remarkRef.current?.value,
		};
		toggleLoading(true);
		const response = await approvePurchaseOrder(data, location.pathname);
		toggleLoading(false);
		if (response.success) {
			toast.success(response.message);
			setOpen(false);
			if (props.clearCache) props.clearCache();
			if (props.closeDialog) props.closeDialog();
			return;
		}
		toast.error(response.message);
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-bold text-2xl">
						Confirm Approval
					</AlertDialogTitle>
					<div className="grid">
						<p className="text-muted-foreground">
							Are you sure you want to approve the Order
							<b className=""> {"(" + props.unique_id + ")"}</b>
						</p>
						<p className="text-muted-foreground">
							<b className="font-semibold">Note: </b>
							That is action cannot be immutable
						</p>
					</div>
				</AlertDialogHeader>
				{approve && (
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
					<Button
						onClick={() => setOpen(false)}
						type="button"
						variant={"ghost"}
						className="font-semibold"
						disabled={loading}
					>
						Cancel
					</Button>

					<Button
						type="button"
						disabled={loading}
						className="font-semibold"
						onClick={() => {
							if (!approve) return toggleApprove(true);
							if (!remarkRef.current?.value)
								return toast.error("A remark is requires", {
									position: "bottom-center",
								});
							if (remarkRef.current?.value.length < 15)
								return toast.error("Remarks requires 15 characters minimum", {
									position: "bottom-center",
								});

							handleApproval();
						}}
					>
						{loading ? "Loading..." : !approve ? "Yes Approve" : "Approve"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}