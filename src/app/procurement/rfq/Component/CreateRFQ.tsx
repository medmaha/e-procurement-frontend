"use client";
import { AxiosError } from "axios";
import React, { ReactNode } from "react";
import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import AddRFQItemsContainer from "./CreateRFQManager";

type Props = {
	text?: string;
	user: AuthUser;
	rfq?: RFQ;
	children?: ReactNode;
};

export default function AddRFQ({ text, user, rfq, children }: Props) {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					{children ? (
						children
					) : (
						<Button className="font-semibold">
							{text ? text : "Add Requisition"}
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="max-w-[95%] border-2 mx-auto overflow-hidden overflow-y-auto max-h-[95dvh] dark:bg-secondary dark:text-secondary-foreground">
					<DialogHeader>
						<DialogTitle className="sm:text-2xl">Create a RFQ</DialogTitle>
						<DialogDescription>
							Include a requisition-specific procurement rfq.
						</DialogDescription>
					</DialogHeader>
					<div className="bg-card rounded-md dark:py-2 dark:px-4">
						{isOpen && (
							<AddRFQItemsContainer
								isOpen
								user={user}
								rfq={rfq}
								closeDialog={() => setIsOpen(false)}
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

function getErrorAsMessageFromAxiosError(error: AxiosError) {}
