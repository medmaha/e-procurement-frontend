"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Vendor(props: any) {
	const [hovering, toggleHovering] = useState(false);
	return (
		<>
			<h1 className="font-bold text-3xl text-center">Account Registration</h1>
			<p className="text-sm text-center pb-4 pt-2">
				<b>Note:</b> You can only register as a vendor to this system
			</p>
			<div
				className={`
				p-6 gap-10 mt-4 max-w-[500px] mx-auto outline outline-2 ${
					hovering ? "outline-sky-500" : "outline-muted"
				} 
				transition duration-150 rounded-md group mb-4 hover:text-sky-500 hover:outline-3
			`}
			>
				<Link
					onMouseEnter={() => toggleHovering(true)}
					onMouseLeave={() => toggleHovering(false)}
					href="/account/signup?register=1"
					className="p-6 transition-[outline,box-shadow] duration-150 hover:border-sky-500 rounded-md text-center cursor-pointer group-hover:shadow-xl border block"
				>
					<span className="font-semibold text-xl pb-2 block">
						Signup as a Vendor
					</span>
					<span className="text-sm leading-relaxed tracking-wide">
						Join us as a vendor to showcase your products and services to our
						network of purchasing professionals. Expand your reach and grow your
						business by connecting with us
					</span>
				</Link>
			</div>
			{props.children}
		</>
	);
}
