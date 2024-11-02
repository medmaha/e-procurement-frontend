import { format } from "date-fns";
import { Key } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import Page404 from "@/app/not-found";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { actionRequest } from "@/lib/utils/actionRequest";
import CreatePurchaseOrder from "../Components/CreatePurchaseOrder";

export default async function page(props: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) {
    const quote_id = props.searchParams.quotation;
    let url = "";
    if (quote_id) {
      url = `/procurement/purchase-orders/create?quotation=${quote_id}`;
    } else {
      url = "/procurement/purchase-orders/create";
    }
    redirect(url);
  }
  const quote_id = props.searchParams.quotation;
  if (!quote_id) {
    return <div>No quotation ID provided</div>;
  }

  const response = await actionRequest<RFQResponse>({
    method: "get",
    url: "/procurement/quotations/respond/retrieve/" + quote_id,
  });

  if (!response.success) {
    return <Page404 error={response} />;
  }

  const quoteRespond = response.data;

  // if (quoteRespond) {
  // 	return (
  // 		<pre>
  // 			<code>{JSON.stringify(quoteRespond, null, 4)}</code>
  // 		</pre>
  // 	);
  // }

  return (
    <section className="p-6 mt-8">
      <div className="grid grid-cols-[auto,1fr] gap-4 overflow-hidden overflow-x-auto">
        <div className="block bg-card mx-auto border rounded-md shadow max-w-[500px] p-6 h-max">
          <div className="grid">
            <h2 className="font-bold text-xl">Purchase Order</h2>
            <p className="max-w-[60ch] text-muted-foreground">
              This section allows you to create a new purchase order. Please
              provide the necessary details and click on {"'Yes Purchase'"} to
              submit the order.
            </p>
          </div>

          <CreatePurchaseOrder user={user} quote_id={quoteRespond.id} />
        </div>
        <div className="block w-full border shadow p-6 rounded-md">
          <div className="grid">
            <h2 className="font-bold text-xl pb-1">RFQ Information</h2>
            <table className="data-table pt-4 text-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Officer</th>
                  <th>Date</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{quoteRespond.rfq.id}</td>
                  <td>{quoteRespond.rfq.officer?.name}</td>
                  <td>{format(new Date(quoteRespond.created_date), "Pp")}</td>
                  <td>{format(new Date(quoteRespond.deadline), "Pp")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid pt-4 pb-8">
            <h2 className="font-semibold text-gl pb-4">RFQ Items</h2>
            <table className="data-table w-full text-xs">
              <thead>
                <tr>
                  <th className="font-light test-xs">
                    <small>#</small>
                  </th>
                  <th className="font-light test-xs">Description</th>
                  <th className="font-light test-xs">QTY</th>
                  <th className="font-light test-xs">M-Unit</th>
                  <th className="font-light test-xs">E-Criteria</th>
                </tr>
              </thead>
              <tbody>
                {quoteRespond.rfq.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <small>{index + 1}.</small>
                    </td>
                    <td>
                      <p className="max-w-[20ch] truncate">
                        {item.item_description}
                      </p>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.measurement_unit}</td>
                    <td>{item.eval_criteria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid pt-6 border-t">
            <div className="flex justify-between gap-4">
              <h2 className="font-bold text-xl pb-1">
                <span>Quotation Details</span>
              </h2>
              <Button variant={"link"} className="font-semibold text-sm">
                View Proforma
              </Button>
            </div>
            <table className="data-table pt-4 text-sm">
              <thead>
                <tr className="border-b">
                  <th>ID</th>
                  <th>Vendor</th>
                  <th>Invited At</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{quoteRespond.unique_id}</td>
                  <td>{quoteRespond.vendor.name}</td>
                  <td>{format(new Date(quoteRespond.created_date), "Pp")}</td>
                  <td>{format(new Date(quoteRespond.last_modified), "Pp")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
