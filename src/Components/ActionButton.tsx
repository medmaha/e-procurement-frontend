"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/Components/ui/button";
import { Loader2, LucideProps } from "lucide-react";
import { cn } from "@/lib/ui/utils";

type Props = {
	text?: string | number;
	showIcon?: boolean;
	formAction?: <T>(formData: FormData) => Promise<T>;
	btnProps?: ButtonProps;
	iconProps?: LucideProps;
};

const defaultIconProps = (size: string) => {
	return (
		{
			sm: "w-4 h-4",
			default: "w-5 h-5",
		} as Json
	)[size];
};

export default function ActionButton(props: Props) {
	const { pending } = useFormStatus();
	const { text = "Submit", showIcon = true } = props;
	return (
		<Button
			size={"sm"}
			disabled={pending}
			{...(props.btnProps || {})}
			className={cn(
				`gap-2 disabled:pointer-events-none`,
				props.btnProps?.className
			)}
		>
			{!!(pending && showIcon) && (
				<Loader2
					className={cn(
						"animate-spin",
						defaultIconProps(props.btnProps?.size ?? "default"),
						props.iconProps?.className
					)}
					{...(props.iconProps || {})}
				/>
			)}
			<span className={`font-semibold ${pending ? "animate-pulse" : ""}`}>
				{text}
			</span>
		</Button>
	);
}
