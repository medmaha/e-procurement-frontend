"use client";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { redirectTo } from "../actions";

import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Loader2 } from "lucide-react";
import { retryPage } from "@/lib/helpers/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function Auth() {
	const abortcontroller = useRef(new AbortController());
	const [timeout, setIsTimeout] = useState(false);

	useLayoutEffect(() => {
		async function init() {
			const response = await fetch("/api/authenticate/refresh", {
				method: "GET",
				credentials: "include",
				signal: abortcontroller.current.signal,
			})
				.then((res) => res.json())
				.then((data: any) => {
					if (data.success) {
						toast.success(data.message, {
							position: "bottom-right",
							hideProgressBar: true,
							toastId: 4,
						});
						return redirectTo(data.path);
					}
					toast.error(data.message, {
						hideProgressBar: true,
						toastId: 4,
					});
					return redirectTo(data.path);
				})
				.catch((err) => {
					alert("Error: " + JSON.stringify(err, null, 4));
					return redirectTo("/account/login");
				})
				.finally(() => {});
		}
		init();
	}, []);

	useEffect(() => {
		const t = setTimeout(() => {
			setIsTimeout((prev) => true);
		}, 1000 * 6);
		return () => clearTimeout(t);
	}, [timeout]);

	return (
		<>
			<div className="w-max">
				<Loader2 className={`w-16 h-16 duration-1000 delay-200 animate-spin`} />
			</div>
			<p className={`text-muted-foreground text-lg pt-2 animate-bounce`}>
				Authenticating Your Session
			</p>
			{timeout && (
				<div className="flex flex-col justify-center gap-4 items-center pt-8">
					<p className="text-xs text-destructive">
						This request is taking longer than expected.
					</p>
					<Button
						onClick={async ({ currentTarget }) => {
							abortcontroller.current.abort();
							currentTarget.disabled = true;
							await retryPage(location.pathname);
							currentTarget.disabled = false;
							setIsTimeout(false);
						}}
					>
						Cancel and Retry
					</Button>
				</div>
			)}
		</>
	);
}
