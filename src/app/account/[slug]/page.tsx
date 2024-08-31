import { getAuthenticatedUser } from "@/lib/auth/generics";
import Main from "./Components/Main";
import { CheckCircle2, User } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { actionRequest } from "@/lib/utils/actionRequest";
import Page404 from "@/app/not-found";
import { returnTo, searchParamsToSearchString } from "@/lib/server/urls";
import { revert_unique_id } from "@/lib/helpers/generator";
import Account from "./Components/Account";
import Personal from "./Components/Personal";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";

type ResponseType = {
	account: Account;
	profile: StaffProfile | VendorProfile;
};

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return returnTo(
			"/account/login",
			`/account/${props.params.slug}`,
			props.searchParams
		);
	}
	const slug = revert_unique_id(props.params.slug);
	if (isNaN(Number(revert_unique_id(slug)))) {
		return (
			<Page404
				error={{ status: 404, message: "Invalid account id_--_User not found" }}
			/>
		);
	}
	const searchString = searchParamsToSearchString(props.searchParams);

	const response = await actionRequest<ResponseType>({
		method: "get",
		url: "/account/users/" + slug + "/" + searchString,
	});

	if (!response.success) return <Page404 error={response} />;

	const { account, profile } = response.data;

	return (
		<section className="section">
			<Account account={account} profile={profile} />
			{profile.profile_type === "Staff" &&
				String(profile.id) === String(user.profile_id) && (
					<>
						{/* Staff Information */}
						<h3 className="font-semibold text-xl md:text-2xl mt-6 pt-4">
							Staff Information
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
							<div className="grid gap-1">
								<p className="font-semibold">Full Name</p>
								<p className="text-sm">{profile.name}</p>
							</div>
							<div className="grid gap-1">
								<p className="font-semibold">Unit</p>
								<p className="text-sm">{profile.unit.name}</p>
							</div>
							<div className="grid gap-1">
								<p className="font-semibold">Department</p>
								<p className="text-sm">{profile.unit.department.name}</p>
							</div>
							<div className="grid gap-1">
								<p className="font-semibold">Job Title</p>
								<p className="text-sm">{profile.job_title || "N/A"}</p>
							</div>
							<div className="grid gap-1">
								<p className="font-semibold">Phone Number</p>
								<p className="text-sm">{profile.phone || "N/A"}</p>
							</div>
							<div className="grid gap-1">
								<p className="font-semibold">Active Status</p>
								<div className="text-sm">
									{account.is_active ? (
										<Badge variant={"success"} className="gap-1.5">
											<CheckCircle2 width={16} height={16} />
											<span>Active</span>
										</Badge>
									) : (
										<Badge variant={"destructive"} className="gap-1.5">
											<CheckCircle2 width={16} height={16} />
											<span>Inactive</span>
										</Badge>
									)}
								</div>
							</div>
							<div className="grid gap-1 col-span-2">
								<p className="font-semibold">Last Modified Date</p>
								<p className="text-sm text-muted-foreground">
									{format(new Date(profile.last_modified), "PPPPpp")}
								</p>
							</div>
						</div>

						{/* Account Authorization */}
						<h3 className="font-semibold text-xl md:text-2xl pt-6 mt-6">
							Authorization Groups
						</h3>
						<div className="bg-card rounded-xl shadow-md border gap-4 mt-4 table-wrapper">
							<table className="table text-sm w-full">
								<thead className="h-[50px]">
									<tr>
										<th className="!px-2">Group Name</th>
										<th className="!px-2">Description</th>
										<th className="!px-2">Created By</th>
										<th className="!px-2">Created Date</th>
									</tr>
								</thead>
								<tbody>
									{profile.groups.map((group) => (
										<tr key={group.id} className="!h-[40px]">
											<td className="!px-2">{group.name || "N/A"}</td>
											<td className="!px-2">
												<p className="line-clamp-2 max-w-[50ch]">
													{group.description || "N/A"}
												</p>
											</td>
											<td className="!px-2">{group.authored_by}</td>
											<td className="!px-2">
												{format(new Date(group.created_date), "PPp")}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{/* Personal And Security Settings */}
						<h3 className="font-semibold text-xl md:text-2xl pt-6 mt-6">
							Account Settings
						</h3>
						<div className="grid md:grid-cols-2 gap-4 mt-4">
							<Personal account={account} profile={profile} />
						</div>
					</>
				)}
		</section>
	);
}
