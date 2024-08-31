import { Button } from "@/Components/ui/button";
import Link from "next/link";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { User } from "lucide-react";

export default function Main() {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-1">
				<div className="container grid min-h-[400px] items-start gap-6 px-4 py-6 mx-auto md:gap-8 lg:grid-cols-4 lg:py-10 lg:max-w-5xl xl:gap-10">
					<div className="order-2 space-y-4 text-center lg:order-1 lg:col-span-1 lg:space-y-6">
						<div className="flex flex-col items-center space-y-2">
							<div className="text-sm font-medium text-gray-500 dark:text-gray-400">
								Next billing date
							</div>
							<div className="text-lg font-bold">March 17, 2022</div>
						</div>
						<nav className="flex flex-row justify-center space-x-4">
							<Link
								className="flex-1 flex flex-col items-center py-2 text-sm rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:underline hover:dark:text-gray-50 hover:dark:underline"
								href="#"
							>
								<span className="sr-only">View</span>
								<ViewIcon className="w-4 h-4" />
								View
							</Link>
							<Link
								className="flex-1 flex flex-col items-center py-2 text-sm rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:underline hover:dark:text-gray-50 hover:dark:underline"
								href="#"
							>
								<span className="sr-only">Edit</span>
								<FileEditIcon className="w-4 h-4" />
								Edit
							</Link>
							<Link
								className="flex-1 flex flex-col items-center py-2 text-sm rounded-lg text-gray-900 dark:text-gray-50 hover:text-gray-900 hover:underline hover:dark:text-gray-50 hover:dark:underline"
								href="#"
							>
								<span className="sr-only">Share</span>
								<ShareIcon className="w-4 h-4" />
								Share
							</Link>
						</nav>
					</div>
					<div className="space-y-4 lg:col-span-3">
						<div className="bg-card p-6 shadow-md border">
							<div className="space-2-4">
								<h4 className="text-lg font-semibold">Personal Information</h4>
								<p className="text-sm text-muted-foreground">
									Update your personal information
								</p>
							</div>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="name">Name</Label>
									<Input id="name" placeholder="Enter your name" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="username">Username</Label>
									<Input id="username" placeholder="Enter your username" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="bio">Bio</Label>
									<Textarea
										className="min-h-[100px]"
										id="bio"
										placeholder="Enter your bio"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										placeholder="Enter your email"
										type="email"
									/>
								</div>
							</div>
							<div className="float-right">
								<Button size="sm">Save</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		
		</div>
	);
}

function FileEditIcon(props: any) {
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
			<path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
			<polyline points="14 2 14 8 20 8" />
			<path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
		</svg>
	);
}

function HelpCircleIcon(props: any) {
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
			<circle cx="12" cy="12" r="10" />
			<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
			<path d="M12 17h.01" />
		</svg>
	);
}

function SettingsIcon(props: any) {
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
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

function ShareIcon(props: any) {
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
			<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
			<polyline points="16 6 12 2 8 6" />
			<line x1="12" x2="12" y1="2" y2="15" />
		</svg>
	);
}

function SignalIcon(props: any) {
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
			<path d="M2 20h.01" />
			<path d="M7 20v-4" />
			<path d="M12 20v-8" />
			<path d="M17 20V8" />
			<path d="M22 4v16" />
		</svg>
	);
}

function ViewIcon(props: any) {
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
			<path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
			<path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
			<path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
			<path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
		</svg>
	);
}
