import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/generics';


export default async function Home() {
	const user = await getAuthenticatedUser();
	if (!user) {
		redirect("/account/login");
	}
	if (user.meta.vendor) redirect("/dashboard/vendor");

	redirect("/dashboard");
}
