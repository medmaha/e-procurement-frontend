import { getAuthenticatedUser } from "@/lib/auth/generics";
import { User } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { actionRequest } from "@/lib/utils/actionRequest";
import Page404 from "@/app/not-found";
import { returnTo, searchParamsToSearchString } from "@/lib/server/urls";
import { revert_unique_id } from "@/lib/helpers/generator";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";

type Props = {
	account: Account;
	profile: StaffProfile | VendorProfile;
};

export default function Account(props: Props) {
	const { account, profile } = props;

	function getFullName() {
		let name = account.first_name;
		if (account.middle_name) name += " " + account.middle_name;
		if (account.last_name) name += " " + account.last_name;
		return name;
	}

	return (
		<div className="border-b">
			<div className="py-6 md:py-8">
				<div className="flex flex-col sm:flex-row items-center justify-between space-x-4">
					<div className="flex items-center space-x-3 pr-6">
						<User className="" width={60} height={60} />
						<div className="flex flex-col">
							<h1 className="text-xl font-bold leading-none">
								{getFullName()}
							</h1>
							<p className="text-sm text-muted-foreground">{account.email}</p>
						</div>
					</div>
					<div className="sm:float-right text-center sm:text-right">
						<Badge
							className="sm:px-4 py-1 px-2 sm:py-2 tracking-wide text-sm md:text-base"
							variant="outline"
						>
							{account.profile_type} Account
						</Badge>
						<p className="text-muted-foreground">
							<b className="text-sm ">Date Joined:</b>{" "}
							<small>{format(new Date(account.created_date), "PPPPp")}</small>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
