"use client";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/Components/ui/dialog";
import { Switch } from "@/Components/ui/switch";

type Props = {
	requisition: Requisition;
};

export default function ViewApproval({ requisition }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					className="capitalize opacity-60 inline-flex items-center gap-1"
				>
					<ApprovedStatus requisition={requisition} />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-max max-h-[90dvh] overflow-auto overflow-y-auto mx-auto">
				<DialogHeader>
					<DialogTitle className="sm:text-2xl">Approval Record</DialogTitle>
					<DialogDescription asChild>
						<p className="text-sm py-0 my-0">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro,
							doloribus?
						</p>
					</DialogDescription>
				</DialogHeader>
				{isOpen && <RequisitionApprovalContent requisition={requisition} />}
			</DialogContent>
		</Dialog>
	);
}

type ContentProps = {
	hideStatus?: boolean;
	showStatusText?: boolean;
	requisition: Requisition;
};

export function RequisitionApprovalContent(props: ContentProps) {
	const { requisition, hideStatus, showStatusText } = props;
	return (
		<>
			<div className="py-2 grid grid-cols-4 gap-6 mt-2">
				{items.map((item) => {
					return (
						<div key={item.name} className="grid gap-1 text-sm">
							<p className="text text-base">{item.label}</p>
							<ApprovedContent
								showStatusText={showStatusText}
								data={
									requisition.approval[item.name] as InnerRequisitionApproval
								}
							/>
						</div>
					);
				})}
			</div>
			{requisition.approval.status.toLowerCase() === "pending" &&
				!hideStatus && (
					<div className="py-2 flex w-full flex-wrap justify-between items-center gap-6 mt-2">
						<div className="grid gap-1">
							<p className="text-lg font-bold">Status</p>
							<p className="capitalize opacity-60 inline-flex items-center gap-1">
								<ApprovedStatus requisition={requisition} animate={true} />
							</p>
						</div>

						{requisition.approval.status.toLowerCase() === "pending" && (
							<div className="grid gap-1">
								<p className="text-lg font-bold">Approval Stage</p>
								<p className="capitalize opacity-60 inline-flex items-center gap-1">
									<span>
										{requisition.approval.stage}
										{["procurement", "finance"].includes(
											requisition.approval.stage.toLowerCase()
										)
											? " Department "
											: " "}
										Approval
									</span>
								</p>
							</div>
						)}
					</div>
				)}
		</>
	);
}

type PropsApproval = {
	animate?: boolean;
	requisition: Requisition;
};

function ApprovedStatus({ requisition, animate }: PropsApproval) {
	return (
		<>
			<span className="pt-0.5 inline-block">
				{requisition.approval.status.toLowerCase() == "pending" ? (
					<Loader2
						size={"16"}
						className={`text-accent-foreground ${
							animate ? "animate-spin" : ""
						}`}
					/>
				) : requisition.approval.status.toLowerCase() == "rejected" ? (
					<X size={"16"} className="text-destructive" />
				) : (
					<Check size={"16"} className="text-primary" />
				)}
			</span>
			<span className="opacity-60">{requisition.approval.status}</span>
		</>
	);
}

type PropsApprovalContent = {
	data: InnerRequisitionApproval;
	showStatusText?: boolean;
};

function ApprovedContent({ data, showStatusText }: PropsApprovalContent) {
	return (
		<p
			className={`inline-flex items-center gap-2 ${
				data.status.toLowerCase() === "accepted"
					? "text-green-500"
					: "text-destructive"
			}`}
		>
			{data.id ? (
				<span
					title={
						data.status.toLowerCase() === "accepted" ? "Approved" : "Declined"
					}
				>
					<Switch
						checked={data.status.toLowerCase() === "accepted"}
						onCheckedChange={() => {}}
						className="cursor-default h-[22px]"
					/>
				</span>
			) : (
				<span title="No Approval" className="text-muted-foreground text-sm">
					{data.status}
				</span>
			)}
			{data.id && showStatusText && (
				<small className="font-semibold uppercase tracking-wide">
					{data.status.toLowerCase() === "accepted" ? "Approved" : "Declined"}
				</small>
			)}
		</p>
	);
}

const items = [
	{
		label: "Unit Approval",
		name: "unit_approval",
	},
	{
		label: "Department Approval",
		name: "department_approval",
	},
	{
		label: "Procurement Department Approval",
		name: "procurement_approval",
	},
	{
		label: "Finance Finance Approval",
		name: "finance_approval",
	},
] as { label: string; name: keyof Requisition["approval"] }[];
