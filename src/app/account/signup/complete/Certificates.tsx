import React from "react";

export default function Certificates(props: any) {
	return (
		<>
			{fields.map((field, idx) => {
				return (
					<div key={idx} className="flex flex-col gap-1 pb-2">
						<label htmlFor={field.name} className="capitalize">
							{underScoreToSpace(field.name)}
						</label>

						<input
							name={field.name}
							id={field.name}
							type={field.type}
							required={field.required}
							defaultValue={props.values[field.name] ?? ""}
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
		type: "file",
		required: true,
		name: "registration_certificates",
	},
	{
		type: "file",
		required: true,
		name: "incorporation_certificates",
	},
	{
		type: "file",
		required: true,
		name: "tax_clearance_certificate",
	},
	{
		type: "file",
		required: true,
		name: "tin_certificate",
	},
	{
		type: "file",
		name: "vat_registration_certificate",
	},
];

function underScoreToSpace(string: string) {
	string = string.replace(/_/gi, " ");
	return string;
}
