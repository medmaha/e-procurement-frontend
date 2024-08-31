"use client";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import SubmitButton from "@/Components/widget/SubmitButton";
import doSignup from "../action";
import Card from "./Card";
import ContactPerson from "./ContactPerson";
import UserAccount from "./UserAccount";
import VendorDetails from "./VendorDetails";

export default function SignupProcess(props: any) {
	const [formData, setFormData] = useState<Json>({});
	const [steps, setSteps] = useState(1);

	function handleFormChange({ target, currentTarget }: any) {
		if (target && target.name && target.value) {
			setFormData((prev) => {
				return { ...prev, [target.name]: target.value };
			});
		}
	}

	async function submit(formData: FormData) {
		if (!formRef.current?.checkValidity())
			return formRef.current?.reportValidity();

		// TODO: validate the form data

		const response = await doSignup(formData);
		if (!response.success) {
			toast.error(response.message, {
				pauseOnFocusLoss: false,
				pauseOnHover: false,
			});
			return;
		}
		toast.success(response.message);
	}

	const formRef = useRef<HTMLFormElement>(null);

	return (
		<>
			<form
				ref={formRef}
				action={submit}
				onChange={handleFormChange}
				className="block max-w-[1200px] mx-auto"
			>
				<Card
					title={
						steps == 1
							? "Vendor Registration"
							: steps == 2
							? "Contact Person"
							: "User Account"
					}
					desc={
						steps == 1 ? (
							<p className="text-sm text-muted-foreground max-w-[60ch] mx-auto">
								Start by entering your organization&apos;s details to register
								as a vendor.
							</p>
						) : steps == 2 ? (
							<p className="text-sm text-muted-foreground max-w-[60ch] mx-auto">
								Please provide the contact details of the primary person
								responsible for vendor communications.
							</p>
						) : (
							<p className="text-muted-foreground max-w-[60ch] text-sm mx-auto">
								Is the contact person identified in the previous step identical
								to the user account being created?
							</p>
						)
					}
					content={
						<>
							<div
								className={`grid grid-cols-2 w-full gap-4 ${
									steps !== 1 ? "hidden" : ""
								}`}
							>
								<VendorDetails formData={formData} />
							</div>
							<div
								className={`grid grid-cols-2 w-full gap-4 ${
									steps !== 2 ? "hidden" : ""
								}`}
							>
								<ContactPerson formData={formData} />
							</div>
							<div
								className={`grid grid-cols-2 w-full gap-4 ${
									steps !== 3 ? "hidden" : ""
								}`}
							>
								<UserAccount formData={formData} />
							</div>
						</>
					}
				>
					<Navigators steps={steps} submit={submit} setSteps={setSteps} />
				</Card>
			</form>
			{props.children}
		</>
	);
}

function Navigators({
	steps,
	setSteps,
	submit,
}: {
	steps: number;
	setSteps: any;
	submit: any;
}) {
	return (
		<div className={"px-2 py-3 flex border-t items-center justify-between"}>
			<p className="inline-block text-xs font-semibold tracking-wide opacity-70">
				<span className="px-1">Step:</span> {steps}/3
			</p>
			<div className="flex items-center gap-6">
				{steps > 1 && (
					<div className="">
						<Button
							type="button"
							onClick={() => setSteps(steps - 1)}
							className="font-semibold"
							variant={"outline"}
							size={"sm"}
						>
							Back
						</Button>
					</div>
				)}
				{steps < 3 && (
					<Button
						type="button"
						onClick={() => setSteps(steps + 1)}
						variant={"default"}
						size={"sm"}
						className="font-semibold"
					>
						Next
					</Button>
				)}
				{steps === 3 && (
					<SubmitButton
						text="Submit"
						type="submit"
						size={"default"}
						className="font-semibold"
					/>
				)}
			</div>
		</div>
	);
}

function ConfirmContactPersonAndUserAccountLink() {
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<p className="text-sm text-gray-600 max-w-[65ch]">
				Is the contact person identified in the previous step identical to the
				user account being created?
			</p>
		</div>
	);
}
