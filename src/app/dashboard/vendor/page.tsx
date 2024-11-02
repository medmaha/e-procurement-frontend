import { format } from "date-fns";
import { ArrowUpNarrowWideIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { retrieveVendor } from "./actions";
import InvoicesChart from "./Components/InvoiceChart";
import QuotesChart from "./Components/QuotesChart";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export default async function Page() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/account/login?next=/dashboard/vendor");
  }
  if (!user.meta.vendor?.id) {
    redirect("/dashboard");
  }

  const vendorResponse = await retrieveVendor();

  if (!vendorResponse.success) {
    return (
      <pre>
        <code>{JSON.stringify(vendorResponse, null, 4)}</code>
      </pre>
    );
  }
  const vendor = vendorResponse.data;

  return (
    <section className="p-6">
      <ClientSitePage
        page={{
          title: "Dashboard",
        }}
      />
      <div className="p-4 mb-8 bg-card shadow border rounded-md flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{vendor.organization_name}</h2>
          <p className="text-muted-foreground text-xs max-w-[60ch] md:max-w-[80ch] line-clamp-2">
            {vendor.description ??
              `No description provided for this organization`}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          <b>Member Since:</b> {format(new Date(vendor.created_date), "PPP")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card shadow p-4 border rounded-md grid gap-4">
          <div className="grid gap-2">
            <h4 className="text-xl font-semibold">Total Sales</h4>
            <p className="text-muted-foreground text-sm line-clamp-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam,
              tempora ex odit dolorum nihil eligendi!
            </p>
          </div>
          <p className="font-bold text-3xl text-muted-foreground">
            D{formatNumberAsCurrency(40000)}
            <span className="inline-flex items-center gap-[1px] pl-4 text-lg">
              <ArrowUpNarrowWideIcon className="text-sm" width={16} />
              {/* <ArrowDownNarrowWide /> */}
              <span>{"12%"}</span>
            </span>
          </p>
          <p className="text-sm text-right text-muted-foreground">
            <b>Latest Sale:</b> {format(new Date(), "PPp")}
          </p>
        </div>
        <div className="bg-card shadow p-4 pb-2 border rounded-md grid gap-2">
          <h3 className="font-semibold text-center text-sm">
            Quotations Received
          </h3>
          <QuotesChart />
        </div>
        <div className="col-span-2 bg-card shadow p-4 pl-0 pb-2 border rounded-md grid gap-2 min-h-[300px]">
          <h3 className="font-semibold text-center">Invoices</h3>
          <InvoicesChart />
        </div>
      </div>
    </section>
  );
}
