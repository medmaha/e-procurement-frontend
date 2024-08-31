import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth/generics';


export const metadata: Metadata = {
	title: "My Organization | E-Procurement",
	description: "Organization staff page",
	keywords:
		"staff, units, branches, departments, organization, procurement, e-procurement",
};

export default async function page() {
	const user = await getAuthenticatedUser();
	if (!user) redirect("/account/login?next=/organization");

	return (
		<section className="p-6">
			<h2 className="font-extrabold text-4xl">Organization Page</h2>
			<p className="text-muted-foreground pt-2 w-max pr-12 pb-4 border-b-4">
				The organization page is currently under development
			</p>
		</section>
	);
}
