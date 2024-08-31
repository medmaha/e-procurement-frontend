"use client";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { generate_unique_id } from "@/lib/helpers/generator";
import { RFQResponseContent } from "@/app/vendors/rfq-requests/Components/BrowseRFQResponse";
import { EyeIcon } from "lucide-react";

type Props = {
	user: AuthUser;
	data: RFQResponse;
};

export default function Review(props: Props) {
	const [isOpen, toggleOpen] = useState(false);
	return (
		<Dialog open={isOpen} onOpenChange={toggleOpen}>
			<DialogTrigger asChild>
				<Button
					size="icon-sm"
					variant={"secondary"}
					title="Review Quotation"
					className="rounded-full hover:bg-card hover:border"
				>
					<EyeIcon />
					<span className="sr-only">Review</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[95svh] md:max-h-[90svh] overflow-hidden overflow-y-auto md:max-w-[80svw]">
				<DialogHeader className="border-b pb-2">
					<DialogTitle className="text-xl font-semibold">
						Quotation{" "}
						<span className="text-muted-foreground">
							({generate_unique_id("", props.data.id)})
						</span>{" "}
						Details
					</DialogTitle>
				</DialogHeader>
				{isOpen && (
					<RFQResponseContent
						data={props.data}
						user={props.user}
						hideStatus={true}
						hideOPenedBy={true}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
