import React from "react";

export default function Organization(props: any) {
	return (
		<>
			{fields.map((field, idx) => {
				return (
					<div key={idx} className="flex flex-col gap-1 pb-2">
						<label htmlFor={field.name} className="capitalize">
							{underScoreToSpace(field.name)}
						</label>
						{field.element === "select" && (
							<select
								name={field.name}
								id={field.name}
								required={field.required}
								className="w-full border p-1.5 px-2 rounded peer disabled:bg-white bg-transparent"
								defaultValue={props.values[field.name] ?? ""}
							>
								<option className="group-focus:hidden" value={""}>
									---------
								</option>
								{field.items?.map((item) => {
									return (
										<option key={item.value} value={item.value}>
											{item.label}
										</option>
									);
								})}
							</select>
						)}
						{field.element === "textarea" && (
							<textarea
								name={field.name}
								id={field.name}
								required={field.required}
								className="w-full border p-1.5 px-2 rounded peer disabled:bg-white bg-transparent"
								defaultValue={props.values[field.name] ?? ""}
							></textarea>
						)}
						{!field.element && (
							<input
								name={field.name}
								id={field.name}
								type={field.type}
								required={field.required}
								defaultValue={props.values[field.name] ?? ""}
								className="w-full border p-1.5 px-2 rounded peer disabled:bg-white"
							/>
						)}
					</div>
				);
			})}
		</>
	);
}

const fields = [
	{
		required: true,
		element: "select",
		name: "registration_type",
		items: [
			{ value: "llc", label: "Limited Liability Company" },
			{ value: "npo", label: "Non-Profit Organization" },
			{ value: "partnership", label: "Partnership" },
			{ value: "sole_proprietorship", label: "Sole Proprietorship" },
			{ value: "corporation", label: "Corporation" },
			{ value: "s_corporation", label: "S Corporation" },
			{ value: "llp", label: "Limited Liability Partnership" },
		],
	},
	{
		required: true,
		type: "date",
		name: "date_established",
	},
	{
		type: "file",
		required: true,
		name: "brand_logo",
	},
	{
		element: "textarea",
		placeholder: "",
		name: "description",
	},
];

function underScoreToSpace(string: string) {
	string = string.replace(/_/gi, " ");
	return string;
}
