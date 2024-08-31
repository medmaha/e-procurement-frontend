import * as React from "react";
import { cn } from "@/lib/ui/utils";

import { DateTimePicker } from "./datetime";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	maxDate?: Date;
	minDate?: Date;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, maxDate, ...props }, ref) => {
		return (
			<>
				{type === "date" ? (
					<DateTimePicker
						{...props}
						defaultValue={props.defaultValue?.toString()}
						name={props.name!}
						toDate={maxDate}
						fromDate={props.minDate}
						ref={ref}
					/>
				) : (
					<input
						type={type}
						className={cn(
							`${
								type === "file" ? "cursor-pointer" : ""
							} flex h-10 w-full rounded-md file:cursor-pointer border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:file:bg-secondary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 file:py-1 dark:file:text-muted-foreground file:rounded-md focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
							className
						)}
						ref={ref}
						{...props}
					/>
				)}
			</>
		);
	}
);
Input.displayName = "Input";

export { Input };
