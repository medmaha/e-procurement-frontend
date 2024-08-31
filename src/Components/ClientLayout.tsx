"use client";
import { usePathname } from "next/navigation";
import React, { createContext, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";

type GlobalClientContext = {
	CACHE: Map<string, any>;
	updateCACHE: (key: string, value: any) => void;
};

export const GlobalClientContext = createContext({} as GlobalClientContext);

export default function ClientLayout(props: any) {
	const pathname = usePathname();

	const cache = useRef(new Map<string, any>());
	const updateCACHE = (key: string, value: any) => {
		cache.current.set(key, value);
	};
	return (
		<GlobalClientContext.Provider value={{ updateCACHE, CACHE: cache.current }}>
			{props.children}
			<ToastContainer
				pauseOnFocusLoss={false}
				pauseOnHover={false}
				newestOnTop={true}
				limit={3}
				theme={props.theme === "dark" ? "colored" : "light"}
				className={"max-w-[65ch] w-max min-w-[30] md:min-w-[40ch]"}
			/>
		</GlobalClientContext.Provider>
	);
}
