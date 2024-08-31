"use client";
import { toast } from 'react-toastify';
import ActionButton from '../../Components/ActionButton';
import { signupComplete } from '../action';
import Card from '../Components/Card';
import Certificates from './Certificates';
import Organization from './Organization';


export default function Form() {
	async function submitForm(formData: FormData) {
		const response = await signupComplete(formData, location.pathname);

		if (response.success) {
			toast.success(response.message);
			return;
		}
		toast.error(response.message);
	}
	return (
		<form action={submitForm} className="block w-full max-w-[1100px] mx-auto">
			<Card
				title="Organization Details"
				content={<Organization values={{}} />}
				desc="Enter your organization details"
			/>
			<Card
				title="Organization Certificates"
				content={<Certificates values={{}} />}
				desc="Upload your organization certificates"
			/>

			<div className="flex items-center justify-center flex-col gap-4 px-4">
				<ActionButton text="Submit" />
				<a
					href="/account/signup/vendor/cancellation/"
					className="font-semibold inline-block text-center text-lg w-full py-1.5 px-4 transition bg-red-600 hover:bg-red-500 text-white rounded-full disabled:animate-pulse disabled:pointer-events-none"
				>
					Cancel Registration
				</a>
			</div>
		</form>
	);
}
