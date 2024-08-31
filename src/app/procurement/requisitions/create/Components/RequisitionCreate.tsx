import React from "react";
import RequisitionCreateWrapper from "./RequisitionCreateWrapper";

export default async function Create({ user }: { user: AuthUser }) {
	const today = new Date().toISOString().split("T")[0];
	return (
		<section className="section">
			<div className="section-heading">
				<h2 className="font-bold text-xl uppercase tracking-wider sm:text-2xl text-center">
					Create New Requisition
				</h2>
			</div>
			<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
				<div className="flex flex-col gap-0.5">
					<p className="text-sm font-semibold">Department</p>
					<p className="text-sm opacity-70">Research And Development</p>
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="text-sm font-semibold">Officer/Staff</p>
					<p className="text-sm capitalize opacity-40">{user.name}</p>
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="text-sm font-semibold">Authorized By</p>
					<p className="text-sm opacity-40">N/A</p>
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="text-sm font-semibold">Date</p>
					<p className="text-sm opacity-40">{today}</p>
				</div>
			</div>

			<RequisitionCreateWrapper user={user} redirectToView={true} />
		</section>
	);
}
