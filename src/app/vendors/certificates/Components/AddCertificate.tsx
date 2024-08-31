"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/Components/ui/popover";
import { createCertificates, updateCertificates } from "../action";
import SubmitButton from "@/Components/widget/SubmitButton";

type Props = {
	data: any;
	children?: any;
};

export default function CreateOrUpdateCertificate(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	async function update(formData: FormData) {
		const caller = props.data.id ? updateCertificates : createCertificates;
		const response = await caller(formData, location.pathname);
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
				{props.children ? (
					props.children
				) : (
					<Button className="font-semibold h-max px-4 py-2">
						Add Certificate
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-[600px] w-full max-h-[98dvh] overflow-hidden overflow-y-auto border">
				<DialogHeader>
					<DialogTitle>
						{props.data
							? "Update Certificate - " + props.data.name
							: "Add a Certificate"}
					</DialogTitle>
					<DialogDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi,
						facilis.
					</DialogDescription>
				</DialogHeader>
				<form action={update} className="grid gap-4 w-full pt-4">
					<FormContent data={props.data ?? {}} />
				</form>
			</DialogContent>
		</Dialog>
	);
}

function FormContent(props: any) {
	return (
		<>
			{props.data.id && (
				<input hidden name="certificate_id" defaultValue={props.data.id} />
			)}
			<div className="grid gap-2">
				<Label htmlFor="name" className="font-semibold text-base">
					Name
				</Label>
				<Input
					id="name"
					placeholder="Certification name"
					name="name"
					required
					defaultValue={props.data.name}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="achieved_from" className="font-semibold text-base">
					Achieved From
				</Label>
				<Input
					id="achieved_from"
					placeholder="Where do you achieve this certificate"
					name="achieved_from"
					defaultValue={props.data.achieved_from}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="data_achieved" className="font-semibold text-base">
					Date Achieved
				</Label>

				<DateTimePicker
					name="date_achieved"
					required
					defaultValue={props.data.data_achieved}
				/>
			</div>
			<div className="grid gap-2">
				<Label
					htmlFor="file"
					className="font-semibold text-base inline-flex w-full justify-between items-center gap-4"
				>
					Certificate File
					{props.data.file && (
						<div className="inline-flex items-center  gap-2 text-muted-foreground text-sm">
							<p>Current File:</p>
							<p className="text-xs hover:text-primary hover:underline underline-offset-2 transition">
								{props.data.file}
							</p>
						</div>
					)}
				</Label>
				<Input
					id="file"
					name="file"
					required={props.data.file ? false : true}
					type="file"
					accept="image/*,application/pdf,text/html"
				/>
			</div>

			<div className="grid gap-2 pt-4">
				<SubmitButton
					text={props.data.name ? "Update Certificate" : "Add Certificate"}
					onSubmitText={
						props.data.name
							? "Updating Certificate..."
							: "Creating Certificate..."
					}
				/>
			</div>
		</>
	);
}

export function DateTimePicker(props: any) {
	const [isOpen, setOpen] = useState(false);
	const [date, setDate] = React.useState<Date | undefined>(props.defaultValue);

	return (
		<Popover open={isOpen} onOpenChange={setOpen}>
			<input
				hidden
				name={props.name}
				defaultValue={date?.toISOString().split("T")[0] ?? ""}
			/>
			<PopoverTrigger asChild onClick={() => setOpen((prev) => !prev)}>
				<Button
					variant={"outline"}
					className={`w-full justify-start text-left font-normal ${
						!date && "text-muted-foreground"
					}`}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
					disabled={props.disabled}
					required={props.required}
					toDate={new Date()}
				/>
			</PopoverContent>
		</Popover>
	);
}
