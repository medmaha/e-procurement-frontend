"use client";
import { AxiosError } from "axios";
import React from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import AddProcurementPlanManager from "./AddProcurementPlanManager";
import { clearErrorIdsFromLocalStorage } from "./helpers";

export default function AddRFQ({ text }: any) {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<>
			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					if (!open) {
						toast.clearWaitingQueue();
						clearErrorIdsFromLocalStorage("toastIds");
					}
					setIsOpen(open);
				}}
			>
				<DialogTrigger asChild>
					<Button className="font-semibold">
						{text ? text : "Add Department Plan"}
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-[95%] mx-auto bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground">
					<DialogHeader>
						<DialogTitle className="sm:text-2xl">
							Department Procurement Plan
						</DialogTitle>
						<DialogDescription>
							Include a department-specific procurement plan.
						</DialogDescription>
					</DialogHeader>
					<AddProcurementPlanManager closeDialog={() => setIsOpen(false)} />
				</DialogContent>
			</Dialog>
		</>
	);
}
