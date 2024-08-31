"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	primaryText?: "text-white" | "text-black";
	primaryColor?:
		| "text-sky-500"
		| "text-red-500"
		| "text-green-500"
		| "text-gray-500";
	maxWidth?: string;
	text: string;
}

/**
 * Renders a button for form action
 *
 * The button's color and text color can be customized via `primaryColor` and `primaryText` props.
 * The button's text content is specified via the `text` prop.
 * The button is disabled when a form is pending submission, indicated by `pending` state.
 *
 * @param {Props} props - The properties passed to the ActionButton component.
 * @returns {ReactNode} The rendered button element.
 */
export default function ActionButton(props: Props) {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className={`${props.maxWidth ?? ""} ${
				props.primaryColor ?? "bg-sky-500"
			} ${
				props.primaryText ?? "text-white"
			} hover:opacity-80 font-semibold text-lg w-full py-1.5 px-4 transition rounded-full disabled:hover:opacity-50 disabled:opacity-50 disabled:pointer-events-none
            `}
		>
			{props.text}
		</button>
	);
}
