import { format } from "date-fns";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import GoBack from "@/Components/ui/GoBack";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { generate_unique_id } from "@/lib/helpers/generator";
import Link from "next/link";
import ActivationButton from "../../Components/ActivationButton";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/procurement/rfq");
	}

	const slug = props.params.slug;
	const response = await actionRequest<VendorRegistration>({
		method: "get",
		url: "/vendors/registration/" + slug + "/",
	});

	if (!response.success) return <Page404 error={response} />;

	const supplierRegistration = response.data;
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
							{supplierRegistration.status === "active" ? (
								<span className=" inline-flex items-center gap-1 uppercase">
									<CheckCircle2
										className="text-green-500"
										width={16}
										height={16}
									/>
									<small className="text-green-500">Active</small>
								</span>
							) : (
								<span className=" inline-flex items-center gap-1 uppercase">
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
							Supplier Registration{" "}
							<span className="text-muted-foreground">
								{generate_unique_id("", supplierRegistration.id)}
							</span>{" "}
							Details
						</h1>
						<p className="text-sm text-muted-foreground pt-1.5">
							Date Created:{" "}
							<span className="font-semibold">
								{format(new Date(supplierRegistration.created_date), "PPPPp")}
							</span>
						</p>
					</div>
				</div>
				<div className="section-content flex justify-between items-center">
					<h3 className="font-semibold text-xl">
						{supplierRegistration.vendor.name} | Registration
					</h3>
					{permissions.update && (
						<div className="flex items-center justify-center gap-4">
							<span className="font-semibold">Active Status:</span>
							<ActivationButton
								size={"default"}
								className="text-lg tracking-wide"
								obj_id={supplierRegistration.id}
								status={supplierRegistration.status}
							/>
						</div>
					)}
				</div>
				<div className="section-content">
					<div className="grid grid-cols-3 gap-4">
						<div className="grid">
							<p className="">Registration No</p>
							<p className="text-sm text-muted-foreground">
								{generate_unique_id("R", supplierRegistration.id)}
							</p>
						</div>
						<div className="grid">
							<p className="">Supplier</p>
							<p className="text-sm text-muted-foreground">
								<Link
									href={`/suppliers/${supplierRegistration.vendor.id}`}
									className="transition underline-offset-4 hover:underline"
								>
									{supplierRegistration.vendor.name}
								</Link>
							</p>
						</div>
						<div className="grid">
							<p className="">Date Registered</p>
							<p className="text-sm text-muted-foreground">
								{format(new Date(supplierRegistration.created_date), "PPPPp")}
							</p>
						</div>

						<div className="grid">
							<p className="">Verification</p>

							<p
								className={`tracking-wide font-semibold text-sm ${
									supplierRegistration.is_validated
										? "text-green-500"
										: "text-destructive"
								}`}
							>
								{supplierRegistration.is_validated ? "VERIFIED" : "UNVERIFIED"}
							</p>
						</div>
						<div className="grid">
							<p className="">Contact Person</p>
							<p className="text-sm text-muted-foreground">
								<Link
									href={`/suppliers/contact-persons/${supplierRegistration.contact_person.id}`}
									className="transition underline-offset-4 hover:underline"
								>
									{supplierRegistration.contact_person.name}
								</Link>
							</p>
						</div>
						<div className="grid">
							<p className="">Active Status</p>
							<p
								className={`tracking-wide font-semibold text-sm ${
									supplierRegistration.status === "active"
										? "text-green-500"
										: "text-destructive"
								}`}
							>
								{supplierRegistration.status === "active"
									? "ACTIVE"
									: "INACTIVE"}
							</p>
						</div>
						<div className="">
							<div className="grid">
								<p className="">Last Modified Date</p>
								<p className="text-sm text-muted-foreground">
									{format(
										new Date(supplierRegistration.last_modified),
										"PPPPp"
									)}
								</p>
							</div>
						</div>
						<div className="grid col-span-2">
							<p className="">Certificates</p>
							<div className="text-sm inline-flex flex-wrap gap-3 pt-1 items-center">
								{supplierRegistration.certificates.map((certificate) => {
									return (
										<div key={certificate.id} className="inline-grid gap-0.5">
											<p className="text-muted-foreground ">
												{certificate.name}
											</p>
											<p className="inline-flex justify-between gap-2 p-2 bg-secondary shadow">
												<Link
													href={`/suppliers/certificates/${certificate.id}`}
													className="transition text-muted-foreground hover:text-card-foreground underline-offset-2 text-xs underline"
												>
													Details
												</Link>
												<a
													target="_blank"
													href={certificate.file}
													className="transition text-muted-foreground hover:text-card-foreground underline-offset-2 text-xs underline"
												>
													File
												</a>
											</p>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
