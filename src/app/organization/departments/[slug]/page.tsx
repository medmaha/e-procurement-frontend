import { format } from "date-fns";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import GoBack from "@/Components/ui/GoBack";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { generate_unique_id } from "@/lib/helpers/generator";
import DepartmentDetails from "../Components/ViewDepartment";
// import UnitDetails from "../Components/UnitDetails";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/procurement/rfq");
	}

	const slug = props.params.slug;

	const response = await actionRequest<Department>({
		method: "get",
		url: `/organization/departments/${slug}/`,
	});

	if (!response.success) return <Page404 error={response} />;

	const unit = response.data;

	return (
		<section className="section">
			<div className="section-heading">
				<div className="grid items-start justify-start">
					<div className="pb-1">
						<GoBack />
					</div>
					<p className="text-sm font-semibold text-muted-foreground inline-flex items-center gap-2">
						Active Status:{" "}
						{!unit.disabled ? (
							<span className=" inline-flex items-center gap-1">
								<CheckCircle2
									className="text-green-500"
									width={16}
									height={16}
								/>
								<small className="text-green-500">Active</small>
							</span>
						) : (
							<span className=" inline-flex items-center gap-1">
								<XCircle className="text-destructive" width={16} height={16} />
								<small className="text-destructive">Inactive</small>
							</span>
						)}
					</p>
				</div>
				<div className="">
					<h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
						Department{" "}
						<span className="text-muted-foreground">
							{generate_unique_id("", unit.id)}
						</span>{" "}
						Details
					</h1>
					<p className="text-sm text-muted-foreground pt-1.5">
						Date Created:{" "}
						<span className="font-semibold">
							{format(new Date(unit.created_date), "PPPPp")}
						</span>
					</p>
				</div>
			</div>
			<div className="section-content">
				<div>
					<h3 className="text-lg sm:text-2xl font-semibold">{unit.name}</h3>
					<p className="text-sm py-0 my-0 line-clamp-2">
						{unit.description || "No description provided for this unit"}
					</p>
				</div>
			</div>
			<div className="section-content">
				<DepartmentDetails department={unit} />
			</div>
		</section>
	);
}
