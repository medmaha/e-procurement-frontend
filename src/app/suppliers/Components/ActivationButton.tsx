"use client";
import { Loader2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { toggleActivation } from "../action";
import { cn } from "@/lib/ui/utils";

type Props = {
	obj_id: ID;
	size?: any;
	className?: string;
	status: "active" | "inactive";
};

export default function ActivationButton(props: Props) {
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState(props.status);

	async function submitActivation() {
		if (loading) return;
		setLoading(true);
		const response = await toggleActivation(
			props.obj_id,
			status === "inactive",
			location.pathname
		);
		setLoading(false);
		if (response.success) {
			setStatus((prev) => {
				if (prev === "active") return "inactive";
				return "active";
			});
		} else {
			toast.error(response.message);
		}
	}
	return (
		<>
			<Button
				disabled={loading}
				size={props.size || "sm"}
				onClick={submitActivation}
				className={cn(
					"font-semibold relative disabled:pointer-events-none disabled:opacity-50",
					props.className
				)}
				variant={status === "active" ? "destructive" : "default"}
			>
				<span className={`${loading ? "-z-10 opacity-0" : ""}`}>
					{status === "active" ? "Disable" : "Enable"}
				</span>

				{loading && (
					<span className=" absolute top-0 left-0 justify-center items-center w-full h-full inline-flex">
						<Loader2 width={16} className="animate-spin" />
					</span>
				)}
			</Button>
		</>
	);
}
