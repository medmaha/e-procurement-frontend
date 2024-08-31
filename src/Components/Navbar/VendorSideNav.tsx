export const VendorAccordions = [
	{
		label: "Dashboard",
		items: [
			{
				label: "Home",
				name: "home",
				href: "/dashboard/vendor",
			},
			{
				label: "About",
				name: "about",
				href: "/about",
			},
		],
	},
	{
		label: "Procurement",
		items: [
			{
				label: "Invoices",
				name: "invoices",
				href: "/vendors/invoices",
			},

			{
				label: "RFQ Invitations",
				name: "quotations",
				href: "/vendors/rfq-requests",
			},
			{
				label: "RFQ Responses Tracking",
				name: "tracking",
				href: "/vendors/rfq-requests/responses",
			},
		],
	},

	{
		label: "Contracts",
		items: [
			{
				label: "Contracts & Negotiations",
				name: "contact_person",
				href: "/vendors/contracts",
			},
		],
	},
	{
		label: "My Organization",
		items: [
			{
				label: "Contact Person",
				name: "contact_person",
				href: "/vendors/contact-person",
			},
			{
				label: "Certificates",
				name: "certificates",
				href: "/vendors/certificates",
			},
			{
				label: "Organization",
				name: "organization",
				href: "/vendors/organization",
			},
		],
	},
];
