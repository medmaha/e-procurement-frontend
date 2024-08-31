"use client";
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
import { ReactElement, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type Props = {
	disabled?:boolean
	title?: ReactNode;
	description?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	children: ReactElement<HTMLButtonElement>;
	onConfirm: (callback: () => void) => Promise<any>;
	showLoadingIcon?: boolean;
};

export default function ActionConfirmation(props: Props) {
	const [isOpen, toggleOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const { showLoadingIcon = true } = props;

	async function confirm() {
		setLoading(true);
		await props.onConfirm(() => toggleOpen(false));
		setLoading(false);
	}

	return (
		<AlertDialog  open={isOpen} onOpenChange={toggleOpen}>
			<AlertDialogTrigger disabled={props.disabled} asChild>{props.children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-semibold">
						{props.title || "Confirmation"}
					</AlertDialogTitle>
					{props.description && (
						<AlertDialogDescription>{props.description}</AlertDialogDescription>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={loading}
						className="disabled:pointer-events-none"
					>
						{props.cancelText || "No Cancel"}
					</AlertDialogCancel>
					<Button disabled={loading} onClick={confirm} className="gap-2">
						{loading && showLoadingIcon && (
							<Loader2 className="w-4 h-4 animate-spin" />
						)}
						<span
							className={`dark:font-semibold  ${
								loading ? "animate-pulse" : ""
							}`}
						>
							{props.confirmText || "Yes Submit"}
						</span>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
