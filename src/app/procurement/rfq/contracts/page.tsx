import { Button } from "@/Components/ui/button";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { generate_unique_id } from "@/lib/helpers/generator";
import { actionRequest } from "@/lib/utils/actionRequest";
import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import FilterBySearch from "../Component/FilterBySearch";
import { Badge } from "@/Components/ui/badge";
import { returnTo } from "@/lib/server/urls";
import ApproveContract from "./Components/ApproveContract";

export default async function Page(props: PageProps) {
  const user = getAuthenticatedUser();

  if (!user) {
    return returnTo(
      "/account/login",
      "procurement/rfq/contracts",
      props.searchParams
    );
  }

  const response = await actionRequest<RFQContract[]>({
    method: "get",
    url: "/procurement/rfq/contracts/list/",
  });

  if (!response.success) return <Page404 error={response} />;

  const contracts = response.data;
  const permissions = response.auth_perms;

  return (
    <section className="section">
      <div className="section-heading !mb-2">
        <div className="grid items-start justify-start">
          <h1 className="header-text text-xl sm:text-2xl md:text-3xl font-bold">
            RFQ Contracts Management
          </h1>
        </div>
        <div className="">
          <Link href={"/procurement/contracts/create"}>
            <Button className="md:text-lg md:font-semibold">
              + New Contract
            </Button>
          </Link>
        </div>
      </div>
      <div className="section-content !bg-accent">
        <div className="grid grid-cols-3">
          <FilterBySearch
            name="search"
            defaultValue={props.searchParams.search}
            placeholder="Search by contract ID, vendor, rfq ID,"
          />
        </div>
      </div>

      <div className="table-wrapper">
        {/* TODO : Use the TabularData Table */}
        <table className="table w-full">
          <thead className="">
            <tr className="h-[50px]">
              <th>
                <small>#</small>
              </th>
              <th>Vendor</th>
              <th>Quotation</th>
              <th>RFQ</th>
              <th>Issued At</th>
              <th>Issued By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <tr key={contract.id}>
                <td>
                  <small>{index + 1}.</small>
                </td>
                <td>
                  <Link
                    href={"/suppliers/" + contract.supplier.id + "/"}
                    className="underline-offset-4 transition hover:underline hover:text-primary"
                  >
                    {contract.supplier.name}
                  </Link>
                </td>
                <td>
                  <Link
                    className="underline-offset-4 transition hover:underline hover:text-primary"
                    href={
                      "/procurement/rfq/responses/" + contract.rfq_response?.id
                    }
                  >
                    {generate_unique_id("Q-", contract.rfq_response?.id)}
                  </Link>
                </td>
                <td>
                  <Link
                    className="underline-offset-4 transition hover:underline hover:text-primary"
                    href={"/procurement/rfq/responses/" + contract.rfq.id}
                  >
                    {generate_unique_id("RFQ", contract.rfq.id)}
                  </Link>
                </td>
                <td>{format(new Date(contract.created_date), "PPP")}</td>
                <td>
                  <Link
                    className="underline-offset-4 transition hover:underline hover:text-primary"
                    href={"/organization/staffs/" + contract.officer.id}
                  >
                    {contract.officer.name}
                  </Link>
                </td>
                <td>
                  <div className="inline-flex gap-1 items-center">
                    {["SUCCESSFUL", "ACTIVE"].includes(contract.status) && (
                      <Badge variant={"success"}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="capitalize">{contract.status}</span>
                      </Badge>
                    )}
                    {["PENDING", "PROCESSING"].includes(contract.status) && (
                      <Badge variant={"outline"} className="">
                        <span className="capitalize">{contract.status}</span>
                      </Badge>
                    )}
                    {["TERMINATED", "UNSUCCESSFUL"].includes(
                      contract.status.toLowerCase()
                    ) && (
                      <Badge variant={"destructive"}>
                        <XCircle className="w-4 h-4" />
                        <span className="capitalize">{contract.status}</span>
                      </Badge>
                    )}
                  </div>
                </td>
                <td>
                  <div className="inline-flex gap-2 items-center">
                    <Link
                      href={`/procurement/rfq/contracts/negotiations/${contract.id}`}
                    >
                      <Button
                        size={"sm"}
                        variant={"secondary"}
                        className="border"
                      >
                        View Details
                      </Button>
                    </Link>

                    {!permissions.update && (
                      <ApproveContract
                        contract={contract}
                        supplier={contract.supplier as any}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground pl-1 pt-4">
        Total Contracts: <b className="pl-2">{contracts.length}</b>
      </p>
    </section>
  );
}
