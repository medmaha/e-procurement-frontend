"use client";
import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/Components/ui/dialog';


export default function Quote() {
	const [isOpen, setOpen] = useState(false);
	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="font-semibold h-max px-2 py-1">Quote</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Response To Quotation</DialogTitle>
					<DialogDescription>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi,
						facilis.
					</DialogDescription>
				</DialogHeader>
				<p>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis odit
					quia explicabo blanditiis pariatur veritatis iusto officiis animi
					eligendi distinctio!
				</p>
			</DialogContent>
		</Dialog>
	);
}
