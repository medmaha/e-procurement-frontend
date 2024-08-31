"use client";

import { Button } from "@/Components/ui/button";
import { format } from "date-fns";
import { FileLock } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
	data: RFQResponse;
};

export default function LockedRFQResponse(props: Props) {
	const { data } = props;
	const router = useRouter();

	return (
		<div className="p-8 space-y-4 text-center w-full mx-auto max-w-[600px]">
			<FileLock size={68} className="mx-auto text-destructive" />
			<h2 className="font-semibold text-lg tracking-wide">
				The deadline for this RFQ has not yet been reached.
			</h2>
			<p className="text-muted-foreground">
				Please try again on <br />
				{format(new Date(data.deadline), "PPPPpp")}
			</p>
			<div className="w-full max-w-[500px] mx-auto pt-4">
				<Button
					onClick={() => router.back()}
					className="w-full text-lg font-semibold"
				>
					Go Back
				</Button>
			</div>
		</div>
	);
}
