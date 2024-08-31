"use client";
import React, { useEffect, useState } from 'react';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';


type Props = {
	text: string;
};

export default function Description(props: Props) {
	const [more, setMore] = useState(false);
	useEffect(() => {
		const length = props.text.length;
		if (length >= 150) setMore(true);
	}, [props.text]);

	return (
		<>
			<p
				className={`max-w-[60ch] line-clamp-2 text-muted-foreground pb-0 mb-0`}
			>
				{props.text}
			</p>
			{more && <FullDescription text={props.text} />}
		</>
	);
}

function FullDescription(props: Props) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<span className="text-xs transition cursor-pointer hover:underline underline-offset-4 h-max p-0">
					Read more...
				</span>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<p
					dangerouslySetInnerHTML={{
						__html: formatText(props.text),
					}}
					className="text-muted-foreground max-h-[70dvh] overflow-hidden overflow-y-auto px-4"
				></p>
				<div className="block pt-6">
					<AlertDialogCancel asChild className="w-full px-6">
						<Button
							className="w-full text-lg font-semibold"
							variant={"secondary"}
						>
							Close
						</Button>
					</AlertDialogCancel>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function formatText(text: string) {
	return text.replace(/\n/, "<br/><br/>");
}
