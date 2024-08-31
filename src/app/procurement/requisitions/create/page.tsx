import { redirect } from 'next/navigation';
import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth/generics';
import RequisitionCreate from './Components/RequisitionCreate';


export default async function Page(props: PageProps) {
	const user = await getAuthenticatedUser();

	if (!user) {
		redirect("/account/login?next=/procurement/requisitions/create");
	}

	return <RequisitionCreate user={user} />;
}
