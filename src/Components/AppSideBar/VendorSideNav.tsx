import {
  LayoutDashboard,
  Home,
  Info,
  ShoppingCart,
  Receipt,
  FileText,
  FileSearch,
  Building,
  UserCircle,
  Briefcase,
  File
} from 'lucide-react'

export const VendorAccordions = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    items: [
      {
        label: "Home",
        name: "home",
        href: "/dashboard/vendor",
        icon: Home,
      },
      {
        label: "About",
        name: "about",
        href: "/about",
        icon: Info,
      },
    ],
  },
  {
    label: "Procurement",
    icon: ShoppingCart,
    items: [
      {
        label: "Invoices",
        name: "invoices",
        href: "/vendors/invoices",
        icon: Receipt,
      },
      {
        label: "RFQ Invitations",
        name: "quotations",
        href: "/vendors/rfq-requests",
        icon: FileText,
      },
      {
        label: "RFQ Responses Tracking",
        name: "tracking",
        href: "/vendors/rfq-requests/responses",
        icon: FileSearch,
      },
    ],
  },
  {
    label: "Contracts",
    icon: File,
    items: [
      {
        label: "Awarded Contracts",
        name: "awarded_contracts",
        href: "/vendors/awarded-contracts",
      },
      {
        label: "Contract Negotiations",
        name: "contract_negotiations",
        href: "/vendors/contract-negotiations",
      },
    ],
  },
  {
    label: "My Organization",
    icon: Building,
    items: [
      {
        label: "Contact Person",
        name: "contact_person",
        href: "/vendors/contact-person",
        icon: UserCircle,
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
        icon: Briefcase,
      },
    ],
  },
]