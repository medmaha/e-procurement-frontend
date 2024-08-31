"use client";
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/Components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import StaffsSelect from '@/Components/widget/StaffsSelect';
import SubmitButton from '@/Components/widget/SubmitButton';
import { createDepartment, updateDepartment } from '../actions';


export default function AddDepartment(props: any) {
	const { text, department, children = false } = props;
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					{children ? (
						children
					) : (
						<Button className="text-lg font-semibold">
							{text ? text : "Add a Department"}
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="max-w-[600px] mx-auto bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground">
					<DialogHeader>
						<DialogTitle className="sm:text-2xl">
							{department ? "Edit Department" : "New Department"}
						</DialogTitle>
						<DialogDescription>
							{department
								? "Update the existing department details."
								: "Provide the details for the new department."}
						</DialogDescription>
					</DialogHeader>
					{isOpen && (
						<Form
							open={isOpen}
							department={department}
							closeDialog={() => setIsOpen(false)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

function Form({ closeDialog, department }: any) {
	async function submit(formData: FormData) {
		const caller = department ? updateDepartment : createDepartment;
		const { message, success } = await caller(formData, location.pathname);
		if (success) {
			toast.success(message);
			return closeDialog();
		}
		toast.error(message);
	}

	function getDefaultValue(fieldName: string) {
		if (!department) return undefined;
		if (fieldName === "department_head") {
			return department.department_head?.id;
		}
		return department[fieldName];
	}

	return (
		<>
			<form action={submit} className="grid gap-1 pt-4">
				{department && (
					<input name="obj_id" defaultValue={department.id} hidden />
				)}
				{fields.map((field) => {
					return (
						<Field
							key={field.name}
							field={field}
							value={getDefaultValue(field.name)}
						/>
					);
				})}
				<div className="px-4 pt-6">
					<SubmitButton
						text={department ? "Update Department" : "Save Department"}
					/>
				</div>
			</form>
		</>
	);
}

function Field({ field, value }: any) {
	return (
		<div className="pb-2">
			<Label className="pb-1 text-base gap-1 font-semibold inline-flex items-start">
				{field.label}
				<span className="text-primary" title=" This field is required">
					{field.required && "*"}
				</span>
				<small className="pl-4 opacity-80 font-light">
					{field.help && <>{"( " + field.help + ")"}</>}
				</small>
			</Label>
			{field.type === "textarea" ? (
				<Textarea
					name={field.name}
					defaultValue={value}
					required={field.required}
				></Textarea>
			) : typeof field.selector === "function" ? (
				<field.selector
					name={field.name}
					defaultValue={value}
					required={field.required}
				/>
			) : (
				<Input
					defaultValue={value}
					type={field.type}
					name={field.name}
					required={field.required}
				/>
			)}
		</div>
	);
}

// form fields for creating a new department of an organization in an e-procurement site
const fields = [
	{
		name: "name",
		label: "Name",
		type: "text",
		help: "The name of the department",
		required: true,
	},
	{
		name: "department_head_id",
		label: "Department Head",
		help: "The staff that manages the department",
		type: "select",
		selector: StaffsSelect,
	},
	{
		name: "phone",
		label: "Phone",
		help: "Contact phone number",
		type: "tel",
		required: true,
	},
	{
		name: "email",
		label: "Email",
		help: "Contact email address",
		type: "email",
	},
	{
		name: "description",
		label: "Description",
		help: "The description of the department",
		type: "textarea",
	},
];
