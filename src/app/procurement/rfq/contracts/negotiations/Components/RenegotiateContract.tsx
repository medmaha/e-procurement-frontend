"use client";
import { useState } from "react";

import { Button } from "@/Components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/Components/ui/dialog";

import RFQContractNegotiationForm from "@/app/procurement/rfq/contracts/Components/NegotiationForm";
import { renegotiateContract } from "../actions";
import { toast } from "react-toastify";

type Props = {
	contract_id: ID;
	data: RFQNegotiationNote;
};

export default function RenegotiateContract(props: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const { data, contract_id } = props;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"outline"}
					className="border sm:text-lg font-semibold w-full dark:bg-slate-200 dark:text-black"
				>
					Renegotiate
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[1100px]">
				{isOpen && (
					<>
						<DialogHeader className="">
							<DialogTitle className="sm:text-xl">Renegotiation</DialogTitle>
							<DialogDescription>
								To renegotiate, please fill this form and submit it.
							</DialogDescription>
						</DialogHeader>

						<div className="flex items-center gap-4 w-full justify-center pt-4 border-t">
							<div className="w-full">
								<RFQContractNegotiationForm
									submitNegotiation={async (formData) => {
										const response = await renegotiateContract(
											formData,
											location.pathname
										);

										if (response.success) {
											toast.success(
												"Contract renegotiated submitted successfully"
											);
											setIsOpen(false);
											return true;
										}
										toast.error(response.message);
										return false;
									}}
									note={data.note}
									contract_id={contract_id}
									delivery_terms={data.delivery_terms}
									payment_method={data.payment_method}
									pricing={data.pricing}
									validity_period={data.validity_period}
								/>
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
