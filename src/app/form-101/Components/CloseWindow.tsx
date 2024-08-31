"use client";
import { X } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function CloseWindow() {
	const closeWindow = () => {
		try {
			window.close();
		} catch (error) {
			window.location.href = "/";
		}
	};
	return (
		<Button
			className="h-max p-1.5 gap-1 text-xl text-destructive"
			variant={"ghost"}
			onClick={closeWindow}
		>
			<X width={36} />
			<span>Exit</span>
		</Button>
	);
}
