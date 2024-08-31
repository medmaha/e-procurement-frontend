import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Switch } from "@/Components/ui/switch";

type Prop = {
	formData: Json;
};

export default function UserAccount(props: Prop) {
	const [useMyContact, toggleUseMyContact] = useState(false);
	return (
		<>
			<div className="grid col-span-2 gap-1">
				<label htmlFor={"contact_is_user"} className="font-semibold">
					Use My Contact Details
				</label>
				<div className="inline-flex items-center gap-4">
					<Switch defaultChecked={false} onCheckedChange={toggleUseMyContact} />
					{useMyContact ? (
						<p className="text-xs text-muted-foreground">
							This copies and matches your contact details with your account
						</p>
					) : (
						<p className="text-xs text-muted-foreground">
							The contact person is not the same with the user account
						</p>
					)}
				</div>
			</div>

			{fields.map((field, idx) => {
				return (
					<div key={idx} className="flex flex-col gap-1 pb-2">
						<label htmlFor={field.name} className="capitalize">
							{underScoreToSpace(
								(field.label ? field.label : field.name).replace("u_", "")
							)}
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
							required={field.required}
							accept={field.accept}
							defaultValue={
								useMyContact && field.c_field
									? props.formData[field.c_field]
									: props.formData[field.name] ?? ""
							}
							className="w-full border p-1.5 px-2 rounded peer disabled:bg-white"
						/>
					</div>
				);
			})}
		</>
	);
}

const fields = [
	{
		type: "email",
		required: true,
		name: "u_email",
		c_field: "c_email",
	},
	{
		required: true,
		name: "u_first_name",
		c_field: "c_first_name",
	},
	{
		required: true,
		name: "u_last_name",
		c_field: "c_last_name",
	},
	{
		name: "u_middle_name",
		c_field: "c_middle_name",
	},

	{
		type: "password",
		required: true,
		name: "u_password",
	},
	{
		type: "password",
		required: true,
		name: "u_confirm_password",
	},
	{
		type: "tel",
		c_field: "c_phone_number",
		name: "u_phone_number",
	},
	{
		type: "file",
		name: "u_avatar",
		label: "Profile Picture",
		accept: "image/png, image/jpeg, image/webp",
	},
];

function underScoreToSpace(string: string) {
	string = string.replace(/_/gi, " ");
	return string;
}
