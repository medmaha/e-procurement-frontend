"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/ui/utils";
import { Button, ButtonProps } from "../ui/button";
import { useEffect, useRef, useState } from "react";

interface Props extends ButtonProps {
	text: string;
	normalBtn?: boolean;
	onSubmitText?: string;
}

export default function SubmitButton(_props: Props) {
	const { text, disabled, normalBtn, ...props } = _props;
	const { pending } = useFormStatus();

	return (
		<>
			<Button
				disabled={disabled || pending}
				{...props}
				className={cn(
					`font-semibold text-lg disabled:pointer-events-none disabled:opacity-50`,
					props.className || "",
					pending && "cursor-not-allowed opacity-50"
				)}
			>
				{props.children ? (
					<>{props.children}</>
				) : (
					<>
						{pending && !normalBtn
							? props.onSubmitText || "Submitting..."
							: text}
					</>
				)}
			</Button>
		</>
	);
}
