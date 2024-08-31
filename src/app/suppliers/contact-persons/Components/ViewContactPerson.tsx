"use client";
import { format } from "date-fns";
import Link from "next/link";
import { useRef, useState } from "react";
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
import SubmitButton from "@/Components/widget/SubmitButton";
import { updateMyContactInfo } from "../action";

type Props = {
	data: ContactPerson;
};

export default function ViewContactPerson(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	async function update(formData: FormData) {
		const data = Object.fromEntries(formData.entries());
		const response = await updateMyContactInfo(data, location.pathname);
		if (response.success) {
			toast.success(response.message);
			formRef.current?.reset();
			return setOpen(false);
		}
		toast.error(response.message);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"secondary"} size={"sm"} className="font-semibold">
					View
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[1000px] w-full max-h-[98dvh] overflow-hidden overflow-y-auto border">
				<DialogHeader>
					<DialogTitle className="text-2xl link">
						<Link href={`/vendors/organization?oid=${props.data.id}`}>
							{props.data.vendor.name}
						</Link>
					</DialogTitle>
				</DialogHeader>
				{isOpen && <ContactPersonDetails data={props.data} />}
			</DialogContent>
		</Dialog>
	);
}

type Props2 = {
	data: ContactPerson;
};

export function ContactPersonDetails(props: Props2) {
	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4 pb-4">
			<div className="grid">
				<p className="">Identifier</p>
				<p className="text-muted-foreground text-sm">{props.data.unique_id}</p>
			</div>
			<div className="grid">
				<p className="">Organization</p>
				<p className="text-muted-foreground text-sm">
					<Link
						href={`suppliers/${props.data.vendor.id}`}
						className="transition underline-offset-4 hover:underline"
					>
						{props.data.vendor.name}
					</Link>
				</p>
			</div>
			<div className="grid">
				<p className="">Full Name</p>
				<p className="text-muted-foreground text-sm">
					{props.data.first_name + " " + props.data.last_name}
				</p>
			</div>
			<div className="grid">
				<p className="">Email Address</p>
				<p className="text-muted-foreground text-sm">{props.data.email}</p>
			</div>
			<div className="grid">
				<p className="">Email Status</p>
				<p
					className={`${
						props.data.verified ? "text-green-500" : "text-destructive text-sm"
					}`}
				>
					{props.data.verified ? "Verified" : "Unverified"}
				</p>
			</div>
			<div className="grid">
				<p className="">Phone Number</p>
				<p className="text-muted-foreground text-sm">
					{props.data.first_name + " " + props.data.last_name}
				</p>
			</div>
			<div className="grid">
				<p className="">Date Joined</p>
				<p className="text-muted-foreground text-sm">
					{props.data.last_modified &&
						format(new Date(props.data.last_modified), "PP")}
				</p>
			</div>
			<div className="grid">
				<p className="">Last Update</p>
				<p className="text-muted-foreground text-sm">
					{props.data.last_modified &&
						format(new Date(props.data.last_modified), "PPPp")}
				</p>
			</div>
			<div className="grid md:col-span-2">
				<p className="">Address</p>
				<p className="text-muted-foreground text-sm">
					{props.data.address?.string || "N/A"}
				</p>
			</div>
		</div>
	);
}
