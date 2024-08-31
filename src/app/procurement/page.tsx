import { redirect } from 'next/navigation';
import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth/generics';


export default async function page() {
	const user = await getAuthenticatedUser();
	if (!user) redirect("/account/login?next=/procurement");

	return (
		<section className="p-6">
			<h2 className="font-extrabold text-4xl">Procurement Page</h2>
			<p className="text-muted-foreground pt-2 w-max pr-12 pb-4 border-b-4">
				The procurement page is currently under development
			</p>
		</section>
	);
}
