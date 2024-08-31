"use client";
import React, { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';
import { Button } from '@/Components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { updateMyContactInfo } from '../action';


type Props = {
	data: any;
};

export default function UpdateContactInformation(props: Props) {
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
				<Button className="font-semibold h-max px-4 py-2">
					Edit Information
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[600px] w-full max-h-[98dvh] overflow-hidden overflow-y-auto border">
				<DialogHeader>
					<DialogTitle>Update Your Contact Information</DialogTitle>
					<DialogDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi,
						facilis.
					</DialogDescription>
				</DialogHeader>
				<form action={update} className="grid gap-4 w-full pt-4">
					<FormContent data={props.data} />
				</form>
			</DialogContent>
		</Dialog>
	);
}

function FormContent(props: any) {
	const { pending } = useFormStatus();
	return (
		<>
			<div className="grid gap-2">
				<Label htmlFor="email" className="font-semibold text-base">
					Email Address
				</Label>
				<Input
					id="email"
					disabled={pending}
					name="email"
					defaultValue={props.data.email}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="first_name" className="font-semibold text-base">
					First Name
				</Label>
				<Input
					id="first_name"
					name="first_name"
					disabled={pending}
					defaultValue={props.data.first_name}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="last_name" className="font-semibold text-base">
					Last Name
				</Label>
				<Input
					id="last_name"
					disabled={pending}
					name="last_name"
					defaultValue={props.data.last_name}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="phone_number" className="font-semibold text-base">
					Phone Number
				</Label>
				<Input
					id="phone_number"
					disabled={pending}
					name="phone_number"
					defaultValue={props.data.phone_number}
				/>
			</div>
			{/* TODO update contact person address */}
			{/* <div className="grid gap-2">
				<Label htmlFor="address" className="font-semibold text-base">
					Address
				</Label>
				<Input
					id="address"
					disabled={pending}
					name="address"
					defaultValue={props.data.address}
				/>
			</div> */}
			<div className="grid gap-2 pt-4">
				<Button className="text-lg font-semibold" disabled={pending}>
					{pending ? "Updating ..." : "Update"}
				</Button>
			</div>
		</>
	);
}
