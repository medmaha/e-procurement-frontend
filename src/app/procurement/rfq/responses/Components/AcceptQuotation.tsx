"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

type Props = {
	quotation: RFQResponse;
};
export default function CreatePurchaseOrder(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const router = useRouter();

	return (
		<AlertDialog open={isOpen} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button className="w-full text-lg font-semibold tracking-wide">
					Create Purchase Request
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-bold text-2xl">
						Confirm Approval
					</AlertDialogTitle>
					<div className="grid">
						<p className="text-muted-foreground">
							Do you want to purchase order for quotation
							<b className=""> {"(" + props.quotation.unique_id + ")"}</b>
						</p>
						<p className="text-muted-foreground">
							<b className="font-semibold">Note: </b>
							This action will invalidate all quotations attached to this RFQ
							{" (" + props.quotation.rfq.id + ")"}
						</p>
					</div>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<Button
						onClick={() => setOpen(false)}
						type="button"
						variant={"ghost"}
						className="font-semibold"
					>
						No Cancel
					</Button>

					<Button
						type="button"
						className="font-semibold"
						onClick={() =>
							router.push(
								`/procurement/purchase-orders/create?quotation=${props.quotation.id}`
							)
						}
					>
						Yes Purchase
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
