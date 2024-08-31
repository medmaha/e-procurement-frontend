"use client";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import GroupsSelect from "@/Components/widget/AuthGroupsSelect";
import SubmitButton from "@/Components/widget/SubmitButton";
import UnitsSelect from "@/Components/widget/UnitsSelect";
import { createStaff, retrieveUpdateStaff, updateStaff } from "../actions";

const CACHE = new Map();

type Props = {
	text?: string;
	staff?: undefined | Staff;
	user: AuthUser;
	children?: ReactNode;
	isAdmin?: boolean;
	autoOpen?: boolean;
};

export default function AddStaff(props: Props) {
	const { text, user, children, autoOpen } = props;
	const [isOpen, setIsOpen] = React.useState(autoOpen);
	const [staff, setStaff] = React.useState(props.staff);

	const fetchStaff = useCallback(async () => {
		if (props.staff) {
			if (CACHE.get("staff_" + props.staff?.id)) {
				return setStaff(CACHE.get("staff_" + props.staff.id));
			}
			const response = await retrieveUpdateStaff(String(props.staff.id));
			if (response.success) {
				const data = { ...props.staff, ...response.data };
				CACHE.set("staff_" + props.staff.id, data);
				setStaff(data);
			}
		}
	}, [props]);

	useEffect(() => {
		isOpen && fetchStaff();
	}, [isOpen, fetchStaff]);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					{children ? (
						children
					) : (
						<Button className="text-lg font-semibold">
							{text ? text : "Add a Staff"}
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="max-w-[650px] mx-auto bg-card text-card-foreground dark:bg-secondary dark:text-secondary-foreground px-2">
					<DialogHeader className="px-4">
						<DialogTitle className="">
							{staff ? "Update Staff" : "Add A Staff"}
						</DialogTitle>
						<DialogDescription asChild>
							{staff ? (
								<p className="">Update the existing staff details.</p>
							) : (
								<>
									<p className="">
										Provide the details for the new staff
										<span className="text-sm">
											<b>Note: A user account will created for this</b>
										</span>
									</p>
								</>
							)}
						</DialogDescription>
					</DialogHeader>
					{isOpen && (
						<Form
							open={isOpen}
							staff={staff}
							closeDialog={() => setIsOpen(false)}
							user={user}
							isAdmin={props.isAdmin}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

type Props2 = {
	closeDialog: () => void;
	staff?: Staff;
	isAdmin?: boolean;
	user: AuthUser;
	open: boolean;
};

function Form({ closeDialog, staff, user, open, isAdmin }: Props2) {
	async function submit(formData: FormData) {
		const { message, success } = await (staff ? updateStaff : createStaff)(
			Object.fromEntries(formData.entries()),
			location.pathname
		);
		if (success) {
			CACHE.delete("staff_" + staff?.id);
			toast.success(message);
			closeDialog();

			return;
		}
		toast.error(message);
	}

	function getDefaultValue(fieldName: string) {
		if (!staff || !staff.id) return undefined;
		if (fieldName === "unit") {
			return staff[fieldName]?.id;
		}
		if (fieldName === "first_name") {
			const [first_name] = staff["name"]?.split(" ");
			return first_name;
		}
		if (fieldName === "middle_name") {
			const [_, middle_name, last_name] = staff["name"].split(" ");
			return last_name ? middle_name : "";
		}
		if (fieldName === "last_name") {
			const [_, middle_name, last_name] = staff["name"].split(" ");
			return last_name ? last_name : middle_name;
		}
		return staff[fieldName as keyof Staff];
	}

	return (
		<>
			<form action={submit} className="grid gap-1">
				{staff && <input name="obj_id" defaultValue={staff?.id} hidden />}
				<div className="max-h-[65dvh] grid gap-2 overflow-hidden overflow-y-auto px-4 pb-2 min-h-[60dvh]">
					{getFields(staff, user).map((field) => {
						return (
							<Field
								key={field.name}
								field={field}
								open={open}
								value={staff && getDefaultValue(field.name)}
							/>
						);
					})}
				</div>
				<div className="px-4 pt-6 border-t">
					<SubmitButton text={staff ? "Update Staff" : "Save Staff"} />
				</div>
			</form>
		</>
	);
}

function Field({ field, value }: any) {
	const { pending } = useFormStatus();
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
					disabled={pending}
					name={field.name}
					defaultValue={value}
					required={field.required}
				></Textarea>
			) : typeof field.selector === "function" ? (
				<field.selector
					defaultValue={value}
					open={open}
					isMulti={true}
					name={field.name}
					disabled={pending}
					required={field.required}
				/>
			) : (
				<Input
					defaultValue={value}
					disabled={pending}
					type={field.type}
					name={field.name}
					required={field.required}
				/>
			)}
		</div>
	);
}

const Gender = ({ name, disabled, required, defaultValue }: any) => {
	// const [value, setValue] = useState<string>();

	// useEffect(() => {
	// 	if (defaultValue) setValue(defaultValue?.trim().toLowerCase());
	// }, [defaultValue]);

	return (
		<Select
			key={defaultValue}
			disabled={disabled}
			required={required}
			name={name}
			// value={value}
			defaultValue={defaultValue}
			// onValueChange={setValue}
		>
			<SelectTrigger>
				<SelectValue></SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="male">Male</SelectItem>
					<SelectItem value="female">Female</SelectItem>
					<SelectItem value="other">Other</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

// form fields for creating a new staff of an organization in an e-procurement site
const fields = [
	{
		name: "first_name",
		label: "First Name",
		type: "text",
		required: true,
	},
	{
		name: "last_name",
		label: "Last Name",
		type: "text",
		required: true,
	},
	{
		name: "email",
		label: "Email Address",
		type: "email",
		required: true,
	},
	{
		name: "groups",
		label: "Groups",
		help: "Auth permissions group to the user account",
		type: "select",
		selector: GroupsSelect,
	},

	{
		name: "unit",
		label: "Unit",
		help: "The unit in which the staff belongs to",
		type: "select",
		selector: UnitsSelect,
		required: true,
	},
	{
		name: "job_title",
		label: "Position",
		hint: "Current position of the staff",
		type: "text",
		placeholder: "e.g. HR, Manager, Developer",
	},
	{
		name: "gender",
		help: "Staff gender",
		label: "Gender",
		type: "select",
		selector: Gender,
	},
	{
		name: "phone",
		label: "Phone Number",
		help: "Staff contact phone number",
		type: "tel",
		required: true,
	},
	{
		name: "biography",
		label: "Biography",
		help: "The biography of the staff",
		type: "textarea",
	},
];

const normalStaffFields = () =>
	fields.filter((f) => !["unit", "groups"].includes(f.name));
const adminStaffEditFields = () =>
	fields.filter((f) => !["last_name", "first_name"].includes(f.name));
const adminSelfEditFields = () =>
	fields.filter((f) => !["groups", "last_name", "first_name"].includes(f.name));

const getFields = (staff?: any, user?: any) => {
	if (!staff) return fields;
	if (staff.is_self && staff.is_admin) return adminSelfEditFields();
	if (staff.is_self) return normalStaffFields();

	return adminStaffEditFields();
};
