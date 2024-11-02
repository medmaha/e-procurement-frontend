import ClientSitePage from "@/Components/ui/ClientSitePage";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { generate_unique_id } from "@/lib/helpers/generator";
import { convertUrlSearchParamsToSearchString } from "@/lib/helpers/transformations";
import { actionRequest } from "@/lib/utils/actionRequest";
import { format } from "date-fns";
import { CheckCircle2, Loader2, SearchIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page(props: PageProps) {
  const user = getAuthenticatedUser();

  const queryString = convertUrlSearchParamsToSearchString(props.searchParams);
  if (!user) {
    return redirect("/account/login?next=/vendors/contracts" + queryString);
  }
  //

  const response = await actionRequest<RFQContract[]>({
    method: "get",
    url: "/vendors/contracts/list/" + queryString,
  });

  if (!response.success) return <Page404 error={response} />;

  const contracts = response.data;

  return (
    <section className="section">
      <ClientSitePage page={{ title: "Contract Negotiations" }} />

	  {/* Searching and filtering */}
	  <div className="flex items-center justify-between flex-wrap gap-4 md:gap-8 w-full p-2.5 border shadow-md rounded-lg mb-4 dark:bg-secondary/50">
	  <div className="relative">
                <Input
                  className="md:w-[300px] lg:w-[400px] pr-4"
                  placeholder="Search by staff name or unit"
                //   defaultValue={searchParams.get("search")?.toString()}
                />
                <Button
                  variant="outline"
                  size={"icon"}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
          </div>

      <div className="table-wrapper">
        {/* TODO : Use the TabularData Table */}
        <table className="table w-full text-sm">
          <thead className="bg-accent py-2">
            <tr className="h-[50px]">
              <th>
                <small>#</small>
              </th>
              <th>Contract ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Negotiations</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {contracts.map((contract, index) => (
              <tr key={contract.id}>
                <td>
                  <small>{index + 1}.</small>
                </td>
                <td>
                  <Link
                    href={`/procurement/rfq/contracts/${generate_unique_id(
                      "",
                      contract.id
                    )}`}
                    className="hover:underline transition underline-offset-4 link"
                  >
                    {generate_unique_id("", contract.id)}
                  </Link>
                </td>

                <td>{format(new Date(contract.created_date), "PPP")}</td>
                <td>
                  {contract.deadline_date
                    ? format(new Date(contract.deadline_date), "PPPp")
                    : "N/A"}
                </td>
                <td>
                  <div className="inline-flex gap-2 items-center">
                    {contract.status.toLowerCase() === "successful" && (
                      <>
                        <CheckCircle2 className="text-green-500" />
                        <span className="text-green-500">ACCEPTED</span>
                      </>
                    )}
                    {contract.status.toLowerCase() === "pending" && (
                      <>
                        <span className="font-semibold text-muted-foreground">
                          Negotiation
                        </span>
                      </>
                    )}
                    {!["pending", "successful"].includes(
                      contract.status.toLowerCase()
                    ) && (
                      <>
                        <XCircle className="text-destructive" />
                        <span className="text-destructive">UNSUCCESSFUL</span>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  {contract.negotiations ? (
                    <div className="ml-2">
                      <Button
                        size={"sm"}
                        variant={"secondary"}
                        className="font-semibold"
                      >
                        Browse
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <div className="inline-flex gap-2 items-center">
                    <Link
                      href={"/vendors/contracts/negotiations/" + contract.id}
                    >
                      <Button size={"sm"} className="font-semibold">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground pl-1 mt-4 pt-2">
        Total Contracts: <b className="pl-2">{contracts.length}</b>
      </p>
    </section>
  );
}
