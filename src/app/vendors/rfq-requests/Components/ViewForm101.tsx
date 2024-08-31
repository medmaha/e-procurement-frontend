"use client";
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button, ButtonProps } from '@/Components/ui/button';


interface Props extends ButtonProps {
	text?: string;
	url: string;
	hideIcon?: boolean;
}

export default function ViewForm101(props: Props) {
	const router = useRouter();
	const { text, url, hideIcon, ...restProps } = props;
	return (
		<Button
			onClick={() => {
				router.push(url);
			}}
			{...{
				variant: "secondary",
				className: "font-semibold text-lg gap-2",
				...restProps,
			}}
		>
			{!hideIcon && <Eye />}
			<span>{text ? text : "View File"}</span>
		</Button>
	);
}
