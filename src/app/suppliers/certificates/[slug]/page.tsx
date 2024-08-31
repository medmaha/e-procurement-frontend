import { format } from "date-fns";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import GoBack from "@/Components/ui/GoBack";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { actionRequest } from "@/lib/utils/actionRequest";
import { generate_unique_id } from "@/lib/helpers/generator";
import VerificationButton from "../Components/VerificationButton";
import Link from "next/link";

export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		return redirect("/account/login?next=/procurement/rfq");
	}

	const slug = props.params.slug;
	const response = await actionRequest<Certificate>({
		method: "get",
		url: "/vendors/certificates/" + slug + "/",
	});

	if (!response.success) return <Page404 error={response} />;

	const certificate = response.data;
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
							<span>Verification Status:</span>
							{certificate.verified ? (
								<span className=" inline-flex items-center gap-1">
									<CheckCircle2
										className="text-green-500"
										width={16}
										height={16}
									/>
									<small className="text-green-500">VERIFIED</small>
								</span>
							) : (
								<span className=" inline-flex items-center gap-1">
									<XCircle
										className="text-destructive"
										width={16}
										height={16}
									/>
									<small className="text-destructive">UNVERIFIED</small>
								</span>
							)}
						</p>
					</div>
					<div className="">
						<h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
							Supplier Certificate{" "}
							<span className="text-muted-foreground">
								{generate_unique_id("", certificate.id)}
							</span>{" "}
							Details
						</h1>
						<p className="text-sm text-muted-foreground pt-1.5">
							Date Created:{" "}
							<span className="font-semibold">
								{format(new Date(certificate.created_date), "PPPPp")}
							</span>
						</p>
					</div>
				</div>
				<div className="section-content flex flex-wrap gap-4 md:gap-6 justify-between items-center">
					<h3 className="font-semibold text-xl">
						{certificate.vendor.name} | {certificate.name}
					</h3>
					{permissions.update && (
						<div className="flex items-center justify-center gap-4">
							<span className="font-semibold">Verification Status:</span>
							<VerificationButton
								size={"default"}
								className="text-lg tracking-wide"
								obj_id={certificate.id}
								verified={certificate.verified}
							/>
						</div>
					)}
				</div>
				<div className="section-content">
					<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
						<div className="grid">
							<p className="">Organization</p>
							<p className="text-sm text-muted-foreground">
								<Link
									href={`/suppliers/${certificate.vendor.id}`}
									className="transition underline-offset-4 hover:underline"
								>
									{certificate.vendor.name}
								</Link>
							</p>
						</div>
						<div className="grid">
							<p className="">Certificate Name</p>
							<p className="text-sm text-muted-foreground">
								{certificate.name}
							</p>
						</div>
						<div className="grid">
							<p className="">Date Achieved</p>
							<p className="text-sm text-muted-foreground uppercase">
								{certificate.date_achieved
									? format(new Date(certificate.date_achieved), "PPPPp")
									: "-"}
							</p>
						</div>
						<div className="grid">
							<p className="">File Type</p>
							<p className="text-sm text-muted-foreground uppercase">
								{certificate.type}
							</p>
						</div>
						<div className="grid">
							<p className="">Verified</p>
							<p
								className={`text-sm uppercase font-semibold ${
									certificate.verified ? "text-green-500" : "text-destructive"
								}`}
							>
								{certificate.verified ? "Verified" : "Unverified"}
							</p>
						</div>
						<div className="grid">
							<p className="">File</p>
							<p className={`text-sm pt-1`}>
								<a
									target="blank"
									href={certificate.file}
									className="transition py-1 px-2 rounded-xl bg-secondary hover:text-secondary-foreground text-muted-foreground underline-offset-4 hover:underline truncate"
								>
									/media/certificate
									{certificate.file.split("/certificates")[1]}
								</a>
							</p>
						</div>

						<div className="grid">
							<p className="">Date Added</p>
							<p className="text-sm text-muted-foreground">
								{format(new Date(certificate.created_date), "PPPPp")}
							</p>
						</div>
						<div className="grid">
							<p className="">Last Modified Date</p>
							<p className="text-sm text-muted-foreground">
								{format(new Date(certificate.last_modified), "PPPPp")}
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
