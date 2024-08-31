"use client";
import CACHE from "@/lib/caching";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { retrieveRFQ } from "../../actions";
import { toast } from "react-toastify";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { generate_unique_id } from "@/lib/helpers/generator";
import { EyeIcon, LinkIcon, Loader2, Settings2Icon, Vote } from "lucide-react";
import EvaluationTable from "./EvaluationTable";
import { refreshPage } from "./actions";
import Link from "next/link";

type Props = {
	quotations: RFQResponse[];
	rfq_id: ID;
	children: ReactNode;
	user: AuthUser;
};

export default function EvaluateQuotations(props: Props) {
	const { quotations, user } = props;
	const [rfq, setRFQ] = useState<RFQ>();
	const [isOpen, toggleOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const ready = useMemo(() => {
		const evaluated = props.quotations.every(
			(quotation) => quotation.evaluation?.length === rfq?.items.length
		);
		return evaluated && rfq;
	}, [props.quotations, rfq]);

	useEffect(() => {
		const rfq_id = props.rfq_id;
		let timeout: ReturnType<typeof setTimeout>;
		async function retrieve() {
			setLoading(true);
			const response = await retrieveRFQ(rfq_id);
			setLoading(false);
			if (response.success) {
				setRFQ(response.data);
				CACHE.set(rfq_id + "_evaluation", response.data, 5 * 60);
			} else {
				toast.error("ERROR! Unable to retrieve RFQ");
			}
		}

		if (isOpen) {
			if (CACHE.has(rfq_id + "_evaluation")) {
				setRFQ(CACHE.get(rfq_id + "_evaluation"));
			} else retrieve();
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [props.rfq_id, isOpen]);

	async function updateReload() {
		refreshPage(location.pathname);
		Promise.resolve();
	}

	return (
		<Dialog open={isOpen} onOpenChange={toggleOpen}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>
			<DialogContent className="max-h-[95svh] w-full overflow-hidden overflow-y-auto max-w-[1000px] lg:max-w-[95svw]">
				<DialogHeader className="border-b pb-2">
					<DialogTitle className="text-xl font-semibold">
						RFQ{" "}
						<span tabIndex={1} className="text-muted-foreground">
							({generate_unique_id("RFQ", props.rfq_id)})
							<span className="sr-only">RFQ ID</span>
						</span>{" "}
						Evaluation
						<div className="inline-flex items-center float-right mr-6 pr-2">
							{rfq && (
								<a
									target="_blank"
									className="mr-4"
									href={`/form-101?m=rfq&i=${props.rfq_id}&close=true`}
								>
									<Button variant={"outline"} className="font-semibold gap-1.5">
										<span>RFQ Details</span>
										<LinkIcon width={16} height={16} />
									</Button>
								</a>
							)}

							{ready && (
								<Link href={`/procurement/rfq/${rfq?.unique_id}/evaluation`}>
									<Button className="font-semibold text-base gap-1.5">
										<span>Evaluation Result</span>
										<EyeIcon />
									</Button>
								</Link>
							)}
						</div>
					</DialogTitle>
					<DialogDescription>
						Review and evaluate the responses received for your request for
						quotation
					</DialogDescription>
				</DialogHeader>
				<div className="min-h-[35svh] ">
					{rfq && (
						<div
							className={`grid w-full grid-cols-1 ${
								loading ? "opacity-50 animate-pulse pointer-events-none" : ""
							}`}
						>
							{rfq.items.map((item, i) => {
								return (
									<EvaluationTable
										updateReload={updateReload}
										index={i}
										item={item}
										quotations={quotations}
										user={user}
										rfq={rfq}
										key={item.id}
									/>
								);
							})}
						</div>
					)}
					{loading && (
						<div className="block text-center pt-16 lg:pt-24 p-6 min-h-[80px]">
							<p className="w-max mx-auto text-center p-1">
								<Loader2 className="animate-spin text-sky-500 mx-auto" />
								Please wait while we fetch the RFQ details{" "}
							</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
