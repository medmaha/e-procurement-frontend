"use client";
import { usePathname } from "next/navigation";
import React, { useContext, useLayoutEffect } from "react";
import { GlobalClientContext } from "@/Components/ClientLayout";

type Props = {
	search: {
		model_name: string;
		model_fields: string;
	};
};

export default function ClientSitePage(props: Props) {
	const pathname = usePathname();
	const globalContext = useContext(GlobalClientContext);
	useLayoutEffect(() => {
		if (props.search.model_name) {
			localStorage.setItem("s-model", props.search.model_name);
			localStorage.setItem("s-fields", props.search.model_fields);
		}
		return () => {
			localStorage.removeItem("s-model");
			localStorage.removeItem("s-fields");
		};
	}, [pathname, props]);
	return <></>;
}
