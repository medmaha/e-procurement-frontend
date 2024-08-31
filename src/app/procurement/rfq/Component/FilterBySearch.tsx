"use client";
import { Input } from "@/Components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
	name: string;
	placeholder?: string;
	defaultValue?: string;
};

export default function FilterBySearch(props: Props) {
	const { defaultValue, name, placeholder } = props;
	const router = useRouter();
	const inputRef = React.useRef<HTMLInputElement>(null);

	async function handleSubmit(formData: FormData) {
		const input = formData.get(name) as string;
		router.push(location.href);
	}

	function handleChange() {
		const url = new URL(location.href);
		if (inputRef.current?.value) {
			url.searchParams.set(name, inputRef.current.value?.toLowerCase());
			window.history.pushState(null, "", url.href);
			return;
		}
		url.searchParams.delete(name);
		history.replaceState(null, "", url.href);
	}

	return (
		<form className="" action={handleSubmit}>
			<Input
				onBlur={({ target }) => {
					if (!target.value && !target.value.length) {
						router.replace(location.href);
					}
				}}
				defaultValue={defaultValue}
				name={name}
				onChange={handleChange}
				ref={inputRef}
				placeholder={placeholder || `Search for ${name}`}
			/>
		</form>
	);
}
