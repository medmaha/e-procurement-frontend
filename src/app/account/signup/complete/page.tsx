import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { getAuthenticatedUser } from '@/lib/auth/generics';
import Form from './Form';


export default async function page() {
	const user = await getAuthenticatedUser();

	if (!user) {
		redirect("/account/login/");
	}

	return (
		<div className="px-4 py-8">
			<h1 className="text-center tracking-wide">
				Hello, <b className="text-xl capitalize">{user.name}</b>!
			</h1>
			<p className="pb-8 text-center text-lg">
				Let&apos;s complete your registration
			</p>
			<Form />
		</div>
	);
}
