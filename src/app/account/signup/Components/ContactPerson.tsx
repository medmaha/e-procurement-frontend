import React from "react";
import { Input } from "@/Components/ui/input";

type Prop = {
	formData: Json;
};

export default function ContactPerson(props: Prop) {
	return (
		<>
			{fields.map((field, idx) => {
				return (
					<div key={idx} className="flex flex-col gap-1 pb-2">
						<label htmlFor={field.name} className="capitalize">
							{underScoreToSpace(field.name.replace("c_", ""))}
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
						<Input
							name={field.name}
							id={field.name}
							type={field.type}
							placeholder={field.placeholder}
							required={field.required}
							defaultValue={props.formData[field.name] ?? ""}
							className="w-full border p-1.5 px-2 rounded peer"
						/>
					</div>
				);
			})}
		</>
	);
}

const fields = [
	{
		required: true,
		name: "c_first_name",
	},
	{
		required: true,
		name: "c_last_name",
	},
	{
		type: "email",
		required: true,
		name: "c_email",
	},
	{
		type: "tel",
		required: true,
		name: "c_phone_number",
	},
	{
		type: "text",
		required: true,
		placeholder: "your city or town",
		name: "c_town",
	},
	{
		name: "c_district",
		placeholder: "Your district",
	},
	{
		name: "c_region",
		placeholder: "Your region",
	},
	{
		required: true,
		name: "c_country",
		placeholder: "Enter your country",
	},
];

function underScoreToSpace(string: string) {
	string = string.replace(/_/gi, " ");
	return string;
}
