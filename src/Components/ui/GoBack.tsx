"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/Components/ui/button";

export default function GoBack({ width, hideText = false }: any) {
	const router = useRouter();

	return (
		<Button
			className="h-max p-1.5 gap-1.5"
			variant={"ghost"}
			onClick={() => router.back()}
		>
			<ArrowLeft width={width || 18} />
			{!hideText && <span className="text-sm">Back</span>}
		</Button>
	);
}
