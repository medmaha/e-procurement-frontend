"use client";
import React from "react";
import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { createAnnualPlan } from "../actions";
import { toast } from "react-toastify";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { useFormStatus } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";

export default function AddAnnualPlan({ text }: any) {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="font-semibold text-lg">
					{!text ? "Create One Now!" : text}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[600px] mx-auto bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground">
				<DialogHeader>
					<DialogTitle className="sm:text-3xl">
						Annual Procurement Plan
					</DialogTitle>
					<DialogDescription className="">
						Provide the details for the annual procurement plan.
					</DialogDescription>
				</DialogHeader>
				<Form closeDialog={() => setIsOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function Form({ closeDialog }: any) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	async function submit(formData: FormData) {
		const year = searchParams.get("year");
		if (year) {
			const date = new Date(year).toISOString().split("T")[0];
			formData.append("year_start", date);
		}
		const { message, success } = await createAnnualPlan(formData, pathname);
		if (success) {
			toast.success(message);
			closeDialog();
			return;
		}
		toast.error(message);
	}
	return (
		<>
			<form action={submit} className="grid gap-2 pt-4">
				{formFields(searchParams).map((field) => {
					return (
						<div className="flex flex-col mb-2" key={field.name}>
							<Label className="text-lg font-semibold">
								{field.label}
								<small className="pl-4 opacity-80 font-light">
									{field.help && <>{"( " + field.help + ")"}</>}
								</small>
							</Label>
							{field.name !== "description" ? (
								<Input
									type={field.type}
									name={field.name}
									required={field.required}
									defaultValue={field.defaultValue ?? ""}
								/>
							) : (
								<Textarea
									name={field.name}
									className="min-h-[20dvh]"
									required={field.required}
								></Textarea>
							)}
						</div>
					);
				})}
				<div className="px-4 pt-6">
					<SubmitButton />
				</div>
			</form>
		</>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			disabled={pending}
			type="submit"
			className="font-semibold text-lg disabled:pointer-events-none disabled:opacity-70 w-full"
		>
			{pending ? "Submitting..." : "Save Annual Plan"}
		</Button>
	);
}

const fields = [
	{
		type: "text",
		name: "title",
		label: "Title",
		help: "Give your plan a title",
	},
	{
		type: "date",
		name: "year_start",
		required: true,
		label: "Year Start",
		defaultValue: "",
		help: "When does your plan start?",
	},
	{
		name: "description",
		label: "Description",
		help: "Describe the plan's purpose and scope",
	},
];

const formFields = (searchParams: any) => {
	const year = searchParams.get("year");
	if (!year) return fields;
	return fields.filter((field) => field.name !== "year_start");
};
