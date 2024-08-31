import { Button } from "@/Components/ui/button";
import Link from "next/link";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
type Props = {
	account: Account;
	profile: StaffProfile;
};
export default function Personal(props: Props) {
	return (
		<>
			<div className="space-y-4">
				<div className="bg-card p-6 shadow-md border">
					<div className="space-2-4 pb-4">
						<h4 className="text-lg font-semibold">Personal Information</h4>
						<p className="text-sm text-muted-foreground">
							Update your personal information
						</p>
					</div>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								placeholder="Enter your email"
								defaultValue={props.account.email}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="first_name">First Name</Label>
							<Input
								id="first_name"
								name="first_name"
								defaultValue={props.account.first_name}
								placeholder="Enter your first name"
							/>
						</div>
						<div className="grid gap-1 grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="middle_name">Middle Name</Label>
								<Input
									id="middle_name"
									name="middle_name"
									defaultValue={props.account.middle_name || undefined}
									placeholder="Enter your middle name"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="last_name">Last Name</Label>
								<Input
									id="last_name"
									name="last_name"
									defaultValue={props.account.last_name}
									placeholder="Enter your last name"
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								className="min-h-[100px]"
								id="bio"
								name="bio"
								defaultValue={props.profile.biography}
								placeholder="Enter your bio"
							/>
						</div>

						<div className="max-w-[300px] mx-auto w-full">
							<Button className="font-semibold w-full" size={"sm"}>
								Save
							</Button>
						</div>
					</div>
				</div>
			</div>
			{/* Password Change */}
			<div className="space-y-4">
				<div className="bg-card p-6 shadow-md border space-y-4">
					<div className="space-2-4 pb-4">
						<h4 className="text-lg font-semibold">Change Password</h4>
						<p className="text-sm text-muted-foreground">
							Update your password
						</p>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="current_password">Current Password</Label>
						<Input
							id="current_password"
							name="current_password"
							placeholder="Enter your current password"
						/>
					</div>
					<div className="grid sm:grid-cols-2 gap-3 sm:gap-2">
						<div className="grid gap-2">
							<Label htmlFor="password_1">New Password</Label>
							<Input
								id="password_1"
								name="password_1"
								placeholder="Enter your new password"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password_2">Confirm New Password</Label>
							<Input
								id="password_2"
								name="password_2"
								placeholder="Confirm your new password"
							/>
						</div>
					</div>
					<div className="max-w-[300px] mx-auto">
						<Button className="font-semibold w-full" size={"sm"}>
							Save
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
