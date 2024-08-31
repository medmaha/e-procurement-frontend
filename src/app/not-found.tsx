"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { retryPage } from "@/lib/helpers/actions";

const initialState = {
	status: 400,
	message: "Sorry, we couldn't find that page",
};

type Props = {
	error?: Json;
};

export default function Page404(props: Props) {
	const [retrying, setRetrying] = useState(false);
	const [state, setState] = useState<typeof initialState>({
		status: props.error?.status ?? 0,
		message: props.error?.message ?? "",
	});
	const router = useRouter();
	useEffect(() => {
		setState({
			status: props.error?.status ?? initialState.status,
			message: props.error?.message ?? initialState.message,
		});
	}, [props]);

	async function retry() {
		if (retrying) return;
		setRetrying(true);
		await retryPage(location.pathname);
		setTimeout(() => {
			setRetrying(false);
		}, 2000);
	}

	return (
		<div className="section mt-20">
			<div className="block w-full max-w-[700px] p-12 rounded-lg bg-card text-card-foreground mx-auto">
				<h2 className="text-center text-4xl sm:text-6xl font-extrabold p-6">
					{state.status}
				</h2>

				{![444, 400].includes(state.status) ? (
					<>
						<p
							dangerouslySetInnerHTML={{
								__html: state.message.replace("_--_", "<br/>"),
							}}
							className="text-center w-full text-lg sm:text-2xl md:text-3xl pb-4"
						></p>
						<div className="pt-6">
							<Button
								className="w-full font-semibold text-lg"
								onClick={() => router.back()}
							>
								Go Back
							</Button>
						</div>
					</>
				) : (
					<>
						<p
							className="text-center text-xl pb-4"
							dangerouslySetInnerHTML={{
								__html: state.message.replace("_--_", "<br/>"),
							}}
						></p>
						{[444].includes(state.status) && (
							<div className="pt-6">
								<Button
									disabled={retrying}
									className="w-full font-semibold text-lg"
									onClick={retry}
								>
									{retrying ? "Retrying..." : "Try Retry"}
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
