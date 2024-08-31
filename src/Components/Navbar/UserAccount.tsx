import { HelpCircle, KeyboardIcon, Settings, User2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

type Props = {
	session: AuthUser;
};

export default function UserAccount({ session }: Props) {
	const [bgColor, textColor] = generateRandomColorBaseOnLetters(
		session,
		session?.name
	);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="cursor-pointer">
				<Button
					style={{
						color: textColor,
						backgroundColor: bgColor,
					}}
					className="h-10 w-10 text-xl p-2 font-bold opacity-90 hover:opacity-100 peer"
				>
					{getFirstCharsOfUserFullName(session)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel className="capitalize" asChild>
					<div className="inline-grid">
						<h3 className="font-semibold text-lg">{session.name}</h3>
						<p className="text-muted-foreground">
							{session.profile_type ?? "Staff"} Account
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link
							href={"/account/" + session.meta.id}
							className="inline-grid grid-cols-[1fr,auto] items-center w-full cursor-pointer"
						>
							<span>Profile</span>
							<User2 width={16} />
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<div className="inline-grid grid-cols-[1fr,auto] items-center w-full cursor-pointer">
							<span>Settings</span>
							<Settings width={16} />
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<div className="inline-grid grid-cols-[1fr,auto] items-center w-full cursor-pointer">
							<span>Keyboard Shortcuts</span>
							<KeyboardIcon width={16} />
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<div className="inline-grid grid-cols-[1fr,auto] items-center w-full cursor-pointer">
							<span>Help</span>
							<HelpCircle width={16} />
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<LogoutButton />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function getFirstCharsOfUserFullName(session: any) {
	if (!session) return "";
	const name = session.name.replace("-", " ").replace(/\s+/gi, " ");

	const nameArray = name.split(" ");
	try {
		return nameArray[0][0] + nameArray[1][0];
	} catch (error) {
		return nameArray[0][0] + "-";
	}
}

function generateRandomColorBaseOnLetters(session: any, letters: string) {
	if (!letters || !session) return ["", ""];

	const randomColor = Math.floor(Math.random() * 16777215).toString(16);

	function generateTextColorBaseOnColor(color: string) {
		const hexColor = parseInt(color, 16);
		const r = (hexColor >> 16) & 0xff;
		const g = (hexColor >> 8) & 0xff;
		const b = hexColor & 0xff;
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;
		return brightness > 128 ? "black" : "white";
	}
	return [`#${randomColor}`, generateTextColorBaseOnColor(randomColor)];
}
