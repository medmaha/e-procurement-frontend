"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function ToastClient(props: any) {
	return (
		<ToastContainer
			pauseOnFocusLoss={false}
			pauseOnHover={false}
			newestOnTop={true}
			limit={3}
			theme={props.theme === "dark" ? "colored" : "light"}
			className={"max-w-[65ch] w-max min-w-[30] md:min-w-[40ch]"}
		/>
	);
}
