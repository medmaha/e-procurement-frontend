"use client";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { toggleActivation } from "../action";
import { cn } from "@/lib/ui/utils";

type Props = {
	obj_id: ID;
	verified: boolean;
	size?: any;
	className?: string;
};

export default function VerificationButton(props: Props) {
	const [loading, setLoading] = useState(false);
	const [verified, setVerified] = useState(props.verified);

	async function submitActivation() {
		if (loading) return;
		setLoading(true);
		const response = await toggleActivation(
			props.obj_id,
			!verified,
			location.pathname
		);
		setLoading(false);
		if (response.success) {
			setVerified((prev) => !prev);
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
				variant={verified ? "destructive" : "default"}
				className={cn(
					"font-semibold relative disabled:pointer-events-none disabled:opacity-50",
					props.className
				)}
			>
				<span className={`${loading ? "-z-10 opacity-0" : ""}`}>
					{verified ? "Invalidate" : "Verify"}
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
