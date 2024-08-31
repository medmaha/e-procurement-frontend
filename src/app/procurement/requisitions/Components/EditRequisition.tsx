"use client";
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/Components/ui/dialog';
import RequisitionCreateWrapper from '../create/Components/RequisitionCreateWrapper';


export default function EditRequisition({
	text,
	children,
	requisition,
	user,
	autoOpen = false,
}: any) {
	const [isOpen, setIsOpen] = useState(autoOpen);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children ? (
					children
				) : (
					<Button className="font-semibold text-sm h-max p-1 px-3">
						{text ? text : "Edit"}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-[1200px] mx-auto bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground">
				<DialogHeader>
					<DialogTitle className="sm:text-2xl">
						{requisition ? "Edit Requisition" : "New Requisition"}
					</DialogTitle>
					<DialogDescription>
						{requisition
							? "Update the existing requisition details."
							: "Provide the details for the new requisition."}
					</DialogDescription>
				</DialogHeader>
				<div className="bg-card rounded-md">
					<RequisitionCreateWrapper
						user={user}
						requisition={requisition}
						closeDialog={() => setIsOpen(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
