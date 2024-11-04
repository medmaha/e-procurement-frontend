"use client"
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/ui/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	className?: string;
	disabled?: boolean;
	required?: boolean;
	toDate?: Date;
	fromDate?: Date;
	ref?: React.LegacyRef<HTMLInputElement>;
}

export function DateTimePicker(props: Props) {
	const [isOpen, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(
		props.defaultValue ? new Date(props.defaultValue as string) : undefined
	);

	return (
		<Popover open={isOpen} onOpenChange={setOpen}>
			<input
				hidden
				name={props.name}
				ref={props.ref}
				defaultValue={date?.toISOString().split("T")[0] ?? ""}
			/>
			<PopoverTrigger
				asChild
				onClick={() => setOpen((prev) => !prev)}
				disabled={props.disabled}
			>
				<Button
					variant={"outline"}
					className={`w-full justify-start text-left font-normal ${
						!date && "text-muted-foreground"
					}`}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className={cn("w-auto p-0", props.className)}
				align="start"
			>
				<Calendar
					mode="single"
					selected={date}
					onSelect={(date) => {
						setDate(date);
						setOpen(false);
					}}
					fromDate={props.fromDate}
					initialFocus
					disabled={props.disabled}
					required={props.required}
					toDate={props.toDate}
				/>
			</PopoverContent>
		</Popover>
	);
}
