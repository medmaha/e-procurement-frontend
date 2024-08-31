"use client"; // Error components must be Client Components
import { Button } from "@/Components/ui/button";
import { ReactElement, SVGProps, useState } from "react";
import { useRouter } from "next/navigation";

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function Error(props: ErrorProps) {
	const router = useRouter();
	const [retrying, setRetrying] = useState(false);
	return (
		<section className="section !pb-0">
			<div className="block w-full mt-12 text-center max-w-[700px] p-12 pb-0 rounded-lg bg-card text-card-foreground mx-auto">
				<div className="flex items-center justify-center">
					<BugIcon className="w-16 h-16" />
				</div>
				<h2 className="text-center text-4xl font-extrabold p-6">
					Oops! Something Went Wrong
				</h2>
				<p className="text-center w-full text-lg  pb-4">
					Don&apos;t worry, just refresh the page or try again later
				</p>
				<div className="pt-6 grid grid-cols-1 gap-4">
					<Button
						disabled={retrying}
						variant={"outline"}
						className="w-full font-semibold text-lg"
						onClick={async () => {
							setRetrying(true);
							await props.reset();
							setRetrying(false);
						}}
					>
						{retrying ? "Retrying..." : "Try Again"}
					</Button>
					<Button
						className="w-full font-semibold text-lg"
						onClick={() => router.push("/")}
					>
						Go Back To Home
					</Button>
				</div>

				{/* Diagnostic */}
				<div className="mt-[150px]">
					<Diagnose {...props} />
				</div>
			</div>
		</section>
	);
}

function BugIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m8 2 1.88 1.88" />
			<path d="M14.12 3.88 16 2" />
			<path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
			<path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
			<path d="M12 20v-9" />
			<path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
			<path d="M6 13H2" />
			<path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
			<path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
			<path d="M22 13h-4" />
			<path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
		</svg>
	);
}

function Diagnose(props: ErrorProps) {
	const [view, setView] = useState(false);

	let message = props.error.digest || props.error.message;
	return (
		<>
			<Button
				onClick={() => setView((p) => !p)}
				className="hover:text-destructive"
				variant={"link"}
				size="sm"
			>
				{!view ? "Open" : "Close"} diagnose details
			</Button>

			{view && (
				<p className="p-4 leading-relaxed rounded bg-destructive text-destructive-foreground border mt-4">
					{message}
				</p>
			)}
		</>
	);
}
