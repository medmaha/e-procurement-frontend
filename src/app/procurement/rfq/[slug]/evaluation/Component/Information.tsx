/**
 * v0 by Vercel.
 * @see https://v0.dev/t/og68sGFTfgm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
	DialogTitle,
	DialogHeader,
	DialogContent,
	Dialog,
	DialogTrigger,
	DialogDescription,
} from "@/Components/ui/dialog";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { generate_unique_id } from "@/lib/helpers/generator";
import { format } from "date-fns";
import { StarIcon } from "lucide-react";
import Rating from "./Rating";

type Props = {
	evaluation: RFQEvaluation;
	data: RFQEvaluationRecord;
};

export default function Information(props: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="" size={"sm"} variant={"secondary"}>
					Info
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[800px] text-xs max-h-[95svh] overflow-hidden overflow-y-auto">
				<DialogHeader className="pb-0">
					<DialogTitle className="text-2xl">Evaluation Details</DialogTitle>
					<DialogDescription>
						Submitted by {props.data.quotation.vendor.name} on{" "}
						{format(new Date(props.data.created_date), "PPPp")}
					</DialogDescription>
				</DialogHeader>
				{/* Evaluations Details */}
				<h4 className="font-semibold pt-4">
					Evaluations For
					<span className="inline-block pl-2 capitalize text-muted-foreground">
						({props.data.item.name})
					</span>
				</h4>

				{/* <div className="grid grid-cols-2">
					<div>Quantity</div>
					<div className="text-right">{props.data.quantity}</div>
				</div> */}
				<div className="grid grid-cols-2">
					<div>Pricing</div>
					<div className="text-right">
						D{formatNumberAsCurrency(props.data.pricing)}
					</div>
				</div>
				{/* 
				<div className="grid grid-cols-2">
					<div>Rating</div>
					<div className="text-right">
						<Rating length={props.data.rating} width={14} />
					</div>
				</div> */}
				{/* <div className="grid grid-cols-2">
					<div>Status</div>
					<div className="text-right capitalize">{props.data.status}</div>
				</div> */}
				<div className="grid grid-cols-2">
					<div>Specifications</div>
					<div className="text-right">
						{props.data.specifications ? (
							<Badge variant={"success"} className="gap-2">
								Available
							</Badge>
						) : (
							<Badge variant={"destructive"} className="gap-2">
								Not Available
							</Badge>
						)}
					</div>
				</div>
				<div className="grid grid-cols-2">
					<div>Evaluation Date</div>
					<div className="text-right">
						{format(new Date(props.data.created_date), "PPPPp")}
					</div>
				</div>
				<div className="grid grid-cols-2">
					<div>Evaluation Officer</div>
					<div className="text-right">
						{props.data.officer.name}
						<span className="inline-block pl-2 text-muted-foreground">
							({generate_unique_id("EMP", props.data.officer.id)})
						</span>
					</div>
				</div>
				<div className="grid gap-2 pb-4 border-b mb-2">
					<div>Comments/Remarks</div>
					<div className="">
						<p
							title={props.data.comments}
							className="sm:line-clamp-3 max-w-[55ch] p-2 border rounded-3xl rounded-tl-none"
						>
							{props.data.comments}
						</p>
					</div>
				</div>

				{/* Quotation Details */}
				<h4 className="font-semibold pt-4">Quotation Details</h4>

				<div className="grid grid-cols-2">
					<div>RFQ ID</div>
					<div className="text-right">
						{generate_unique_id("RFQ", props.evaluation.rfq.id)}
					</div>
				</div>
				<div className="grid grid-cols-2">
					<div>Quotation ID</div>
					<div className="text-right">
						{generate_unique_id("Q-", props.data.quotation.id)}
					</div>
				</div>
				<div className="grid grid-cols-2">
					<div>Vendor</div>
					<div className="text-right">{props.data.quotation.vendor.name}</div>
				</div>
				<div className="grid grid-cols-2">
					<div>Submitted Date</div>
					<div className="text-right">{format(new Date(), "PPPp")}</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
