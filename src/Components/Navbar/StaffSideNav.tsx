export const StaffAccordions = [
	{
		label: "Dashboard",
		items: [
			{
				label: "Home",
				name: "home",
				href: "/dashboard",
			},
			{
				label: "Requisitions",
				name: "requisitions",
				href: "/procurement/requisitions",
			},
			{
				label: "Create Requisition",
				name: "create_requisition",
				href: "/procurement/requisitions/create",
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
				label: "RFQ",
				name: "rfq",
				href: "/procurement/rfq",
			},
			{
				label: "RFQ Responses",
				name: "rfq_responses",
				// href: "/procurement/quotations",
				href: "/procurement/rfq/responses",
			},
			{
				label: "Tender",
				name: "restricted_tender",
				href: "/procurement/tender",
			},

			{
				label: "Single Sourcing",
				name: "single_sourcing",
				href: "/procurement/single_sourcing?create",
			},
			{
				label: "Purchase Orders",
				name: "purchase-orders",
				href: "/procurement/purchase-orders",
			},
			{
				label: "Invoices",
				name: "invoices",
				href: "/procurement/invoices",
			},
			{
				label: "Contracts Management",
				name: "contracts",
				href: "/procurement/rfq/contracts",
			},
		],
	},
	{
		label: "Suppliers",
		items: [
			{
				label: "Registration",
				name: "vendor_registration",
				href: "/suppliers/registrations",
			},
			{
				label: "Certificates",
				name: "certificates",
				href: "/suppliers/certificates",
			},
			{
				label: "Contact Persons",
				name: "contact_person",
				href: "/suppliers/contact-persons",
			},
			{
				label: "All Vendors",
				name: "quotation_sent",
				href: "/suppliers",
			},
		],
	},

	{
		label: "My Organization",
		items: [
			{
				label: "Staffs",
				name: "staffs",
				href: "/organization/staffs",
			},
			{
				label: "Units",
				name: "units",
				href: "/organization/units",
			},
			{
				label: "Departments",
				name: "departments",
				href: "/organization/departments",
			},
			{
				label: "Procurement Plan",
				name: "procurement_plan",
				href: "/organization/plans",
			},
			{
				label: "Procurement Thresholds",
				name: "procurement_thresholds",
				href: "/organization/plans/thresholds",
			},
		],
	},

	{
		label: "Auth Management",
		items: [
			{
				label: "Users",
				name: "users",
				href: "/auth-manager/users",
			},
			{
				label: "Groups",
				name: "groups",
				href: "/auth-manager/groups",
			},
			{
				label: "Logs",
				name: "logs",
				href: "/auth-manager/logs",
			},
		],
	},
];
