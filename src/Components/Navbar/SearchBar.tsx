"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { GlobalClientContext } from "../ClientLayout";
import { Input } from "../ui/input";

export default function SearchBar({ user }: any) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const queryRef = useRef<HTMLInputElement>(null);
	const globalContext = useContext(GlobalClientContext);
	const [state, setState] = useState({ model: "", modelFields: "" });

	useLayoutEffect(() => {
		//
	}, []);

	useLayoutEffect(() => {
		setState({
			model: localStorage.getItem("s-model") || "",
			modelFields: localStorage.getItem("s-fields") || "",
		});
	}, [pathname, searchParams]);

	function handleQuerySubmit(formData: FormData) {
		//
	}

	let placeholder = `Search`;
	if (state.model) placeholder += `  ${state.model}`;
	if (state.modelFields)
		placeholder += `   -  Filter by (${state.modelFields})`;

	return (
		<form
			action={handleQuerySubmit}
			onSubmit={(ev) => {
				ev.preventDefault();
			}}
			className="hidden_ _sm:block w-full max-w-[500px]"
		>
			<Input
				ref={queryRef}
				type="text"
				name="q"
				placeholder={placeholder}
				className="w-full border-2"
			/>
		</form>
	);
}
