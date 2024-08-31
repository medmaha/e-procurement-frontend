"use client";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { doLogin } from "./actions";
import ActionButton from "@/Components/ActionButton";

export default function Form() {
	const ref = useRef<HTMLFormElement>(null);
	return (
		<form
			ref={ref}
			action={async (formData) => {
				const data = await doLogin(formData);
				if (data.error) {
					toast.error(data.message, {
						position: "bottom-center",
						autoClose: 7000,
					});
					const passwordField = ref.current?.querySelector(
						'[type="password"]'
					) as HTMLInputElement;
					if (passwordField) {
						passwordField.value = "";
					}
				} else {
					ref.current?.reset();
					toast.success(data.message, {
						position: "top-right",
						autoClose: 2500,
						closeOnClick: false,
						hideProgressBar: true,
					});
				}
			}}
			className="block w-full"
		>
			<div className="pb-4 group">
				<label
					htmlFor="email"
					className="inline-flex items-center gap-1 text-lg pb-1"
				>
					<span>Email Address</span>

					<span title="Field is required" className="font-bold text-primary">
						*
					</span>
				</label>

				<EmailField />

				<p className="text-sm hidden text-destructive px-1 error-msg">
					Email Address field is required
				</p>
			</div>
			<div className="pb-4 pt-2 group">
				<label
					htmlFor="password"
					className="inline-flex items-center gap-1 text-lg pb-1"
				>
					<span>Password</span>

					<span title="Field is required" className="font-bold text-primary">
						*
					</span>
				</label>

				<PasswordField />

				<p className="text-sm hidden text-destructive px-1 error-msg">
					Password field is required
				</p>
			</div>
			<div className="flex items-center px-4 pt-4">
				<SubmitButton />
			</div>
		</form>
	);
}

function EmailField() {
	return (
		<Input
			required
			type="email"
			id="email"
			name="email"
			placeholder="abc@example2.com"
			className="py-1.5 w-full "
		/>
	);
}
function PasswordField() {
	return (
		<Input
			required
			type="password"
			id="password"
			name="password"
			placeholder="-----------"
			className="py-1.5  w-full"
		/>
	);
}
function SubmitButton() {
	return (
		<ActionButton
			text={"Submit"}
			btnProps={{
				className: "font-semibold text-lg w-full rounded-2xl h-[38px]",
			}}
		/>
	);
}
