"use client";
import { ReactNode, useState } from "react";
import { useFormStatus } from "react-dom";
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { createGroup } from "../actions";
import { Group } from "../types";
import PermissionSelector from "./PermissionSelector";

type Props = {
	user: AuthUser;
	group?: Group;
	text?: ReactNode;
	children?: ReactNode;
};

export default function AddOrEditGroup({ text, children, group, user }: Props) {
	const [isOpen, setIsOpen] = useState(false);
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
			<DialogContent className="max-w-[1100px] min-h-[70dvh] mx-auto bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground">
				<DialogHeader>
					<DialogTitle className="sm:text-2xl">
						{group ? "Edit Group" : "New Group"}
					</DialogTitle>
					<DialogDescription>
						{group
							? "Update the existing group details."
							: "Provide the details for the new group."}
					</DialogDescription>
				</DialogHeader>
				{isOpen && (
					<div className="bg-card dark:p-4 h-full dark:rounded-md">
						<Form closeDialog={setIsOpen} group={group} />
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

type FormProps = {
	group?: Group;
	closeDialog: any;
};

function Form({ closeDialog, group }: FormProps) {
	const handleSubmit = async (formData: FormData) => {
		const response = await createGroup(formData, location.pathname, !!group);
		if (response.success) {
			toast.success(response.message);
			closeDialog(false);
			return;
		}
		toast.error(response.message);
	};
	return (
		<form
			action={handleSubmit}
			className="grid sm:gap-x-6 gap-x-4 sm:grid-cols-[400px,1fr] w-full min-h-[35dvh]"
		>
			{group && <input hidden name="group_id" defaultValue={group.id} />}
			<div className="">
				<div className="grid gap-4 w-full">
					<div className="grid gap-2">
						<Label>Name</Label>
						<Input placeholder="name" name="name" defaultValue={group?.name} />
					</div>
					<div className="grid gap-2">
						<Label>Description</Label>
						<Textarea
							name="description"
							rows={2}
							defaultValue={group?.description}
							className="h-[80px] max-h-[40px]"
							placeholder="write a short desc about this group"
						></Textarea>
					</div>
					<div className="grid pt-4 px-6">
						<SubmitButton />
					</div>
				</div>
			</div>
			<div className="">
				<PermissionSelector perms={group?.permissions} />
			</div>
		</form>
	);
}

function SubmitButton({ text }: any) {
	const { pending } = useFormStatus();
	return (
		<Button
			disabled={pending}
			type="submit"
			className="font-semibold h-[40px] text-lg disabled:pointer-events-none disabled:opacity-70 w-full"
		>
			{pending ? "Submitting ..." : "Submit"}
		</Button>
	);
}
