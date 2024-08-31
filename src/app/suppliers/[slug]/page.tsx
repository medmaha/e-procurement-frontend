import { format } from "date-fns";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import GoBack from "@/Components/ui/GoBack";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import SupplierDetails from "../Components/SupplierDetails";
import Description from "../Components/SupplierDescription";
import { Button } from "@/Components/ui/button";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/procurement/rfq");
	}

	const slug = props.params.slug;

	// TODO Validate slug

	const response = await actionRequest<Vendor>({
		method: "get",
		url: "/vendors/" + slug + "/",
	});

	if (!response.success) return <Page404 error={response} />;

	const supplier = response.data;
	const permissions = response.auth_perms;

	return (
		<>
			<section className="section">
				<div className="section-heading">
					<div className="grid items-start justify-start">
						<div className="pb-1">
							<GoBack />
						</div>
						<p className="text-sm font-semibold text-muted-foreground inline-flex items-center gap-2">
							<span>Active Status:</span>
							{supplier.active ? (
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
									<XCircle
										className="text-destructive"
										width={16}
										height={16}
									/>
									<small className="text-destructive">Inactive</small>
								</span>
							)}
						</p>
					</div>
					<div className="">
						<h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
							Supplier{" "}
							<span className="text-muted-foreground">
								{supplier.unique_id}
							</span>{" "}
							Details
						</h1>
						<p className="text-sm text-muted-foreground pt-1.5">
							Date Created:{" "}
							<span className="font-semibold">
								{format(new Date(supplier.created_date), "PPPPp")}
							</span>
						</p>
					</div>
				</div>
				<div className="section-content">
					<div className="">
						<h2 className="font-bold text-2xl">{supplier.organization_name}</h2>

						<div className="">
							<Description
								text={supplier.description || "No description provided."}
							></Description>
						</div>
					</div>
					{permissions?.update && (
						<div className="">
							<Button className="font-semibold text-lg">Update</Button>
						</div>
					)}
				</div>
				<SupplierDetails
					vendor={supplier}
					permissions={permissions}
					user={user}
				/>
			</section>
		</>
	);
}
