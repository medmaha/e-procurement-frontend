import React from "react";
import { Input } from "@/Components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";

type Prop = {
	formData: Json;
};

export default function VendorDetails(props: Prop) {
	const file_types = [".pdf", ".xlsx", ".doc", ".docx", ".png", ".jpeg"];
	return (
		<>
			{fields.map((field, idx) => {
				return (
					<div key={idx} className="grid gap-1 pb-2">
						<label htmlFor={field.name} className="capitalize">
							{field.label ? field.label : underScoreToSpace(field.name)}
							{field.required ? (
								<span
									title="This field is required"
									className="pl-2 text-lg link"
								>
									*
								</span>
							) : (
								<span className="text-muted-foreground pl-2 text-xs">
									{`(optional)`}
								</span>
							)}
						</label>
						{field.element === "select" && (
							<Select
								name={field.name}
								required={field.required}
								defaultValue={props.formData[field.name] ?? ""}
							>
								<SelectTrigger>
									<SelectValue placeholder="-------" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>{field.hint}</SelectLabel>
										{field.items?.map((item) => {
											return (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											);
										})}
									</SelectGroup>
								</SelectContent>
							</Select>
						)}
						{!field.element && (
							<Input
								placeholder={field.placeholder}
								name={field.name}
								id={field.name}
								type={field.type}
								accept={
									field.type === "file"
										? field.accept || file_types.join(",")
										: ""
								}
								required={field.required}
								defaultValue={props.formData[field.name] ?? ""}
								maxDate={
									field.name == "established_date" ? new Date() : undefined
								}
								className="w-full border p-1.5 px-2 rounded peer disabled:bg-white"
							/>
						)}
					</div>
				);
			})}
			<div className="flex flex-col gap-1 pb-2">
				<Textarea
					name="description"
					placeholder="Enter your organization description  (optional)"
				/>
			</div>
		</>
	);
}

const fields = [
	{
		required: true,
		name: "organization_name",
		placeholder: "The official name of your organization",
	},
	{
		name: "alias",
		placeholder: "An alias for your organization",
	},
	{
		required: true,
		type: "file",
		name: "registration_certificate",
	},
	{
		type: "number",
		required: true,
		name: "license_number",
		placeholder: "Enter your license number",
	},
	{
		type: "file",
		required: true,
		name: "tin_certificate",
		label: "TIN Certificate",
	},
	{
		type: "number",
		required: true,
		placeholder: "Enter your TIN number",
		name: "tin_number",
		label: "TIN Number",
	},
	{
		name: "vat_certificate",
		type: "file",
		label: "VAT Certificate",
	},
	{
		name: "vat_number",
		type: "number",
		label: "VAT Number",
	},
	{
		type: "file",
		required: true,
		accept: "image/png, image/jpeg, image/webp",
		name: "logo",
		Label: "Logo Brand",
	},
	{
		element: "select",
		name: "industry",
		hint: "Select the industry that matches your organization",
		items: [
			{ value: "agriculture", label: "Agriculture" },
			{ value: "construction", label: "Construction" },
			{ value: "education", label: "Education" },
			{ value: "finance", label: "Finance" },
			{ value: "healthcare", label: "Healthcare" },
			{ value: "technology", label: "Technology" },
			{ value: "manufacturing", label: "Manufacturing" },
			{ value: "transportation", label: "Transportation" },
			{ value: "real_estate", label: "Real Estate" },
			{ value: "retail", label: "Retail" },
			{ value: "telecommunications", label: "Telecommunications" },
			{
				value: "transportation_and_logistics",
				label: "Transportation and Logistics",
			},
			{ value: "utilities", label: "Utilities" },
			{ value: "wholesale", label: "Wholesale" },
		],
	},
	{
		element: "select",
		name: "registration_type",
		hint: "Select your registration type",
		items: [
			{ value: "Corporation", label: "Corporation" },
			{ value: "Sole Proprietorship", label: "Sole Proprietorship" },
			{ value: "Non Profit Organization", label: "Non Profit Organization" },
			{
				value: "Limited Liability Company (LLC)",
				label: "Limited Liability Company (LLC)",
			},
			{ value: "Other", label: "Other" },
		],
	},
	{
		type: "url",
		placeholder: "www.example.com",
		name: "website",
	},
	{
		type: "date",
		required: true,
		name: "established_date",
	},
];

function underScoreToSpace(string: string) {
	string = string.replace(/_/gi, " ");
	return string;
}
