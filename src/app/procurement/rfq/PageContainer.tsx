"use client";
import { Button } from "@/Components/ui/button";
import ClientSitePage from "@/Components/ui/ClientSitePage";
import { actionRequest } from "@/lib/utils/actionRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import AddRFQ from "./Component/CreateRFQ";
import FilterByYear from "@/app/organization/plans/Components/FilterByYear";
import { Input } from "@/Components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import RFQTable from "./Component/RFQTable";
import { useSearchParams } from "next/navigation";
import { searchParamsToSearchString } from "@/lib/server/urls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { title } from "process";

type Props = {
  user: AuthUser;
  searchParams?: Json;
};

type UseQueryRFQData = {
  response: RFQ[];
};
type UseQueryQuotationsData = {
  response: Quotation[];
};

type UseQueryData = {
  permissions: AuthPerm;
} & (UseQueryRFQData | UseQueryQuotationsData);

export default function PageContainer(props: Props) {
  const [tabs, setTabs] = useState(() => {
    const searchString = searchParamsToSearchString(props.searchParams || {});
    return {
      name: props.searchParams?.tab || "rfq",
      searchString: searchString || "",
    };
  });

  const searchParams = useSearchParams();

  const { data, isLoading } = useQuery<UseQueryData>({
    enabled: tabs.name === "rfq",
    queryKey: ["rfq"],
    queryFn: async () => {
      if (tabs.name === "rfq") {
        const response = await actionRequest<RFQ[]>({
          method: "get",
          url: "/procurement/rfq/" + tabs.searchString,
        });

        if (!response.success) throw new Error(response.message);

        return {
          response: response.data,
          permissions: response.auth_perms,
        };
      }

      return {
        response: [],
        permissions: {
          create: false,
          read: false,
          update: false,
          delete: false,
          approve: false,
        },
      };
    },
  });

  const { response, permissions } = data || {};

  return (
    <>
      <ClientSitePage
        page={{
          title:
            tabs.name === "rfq"
              ? "Request For Quotation"
              : "Quotation Responses",
        }}
      />
      <Tabs
        defaultValue={tabs.name}
        onValueChange={(value) => setTabs({ ...tabs, name: value })}
        className="w-full"
      >
        <div className="flex w-full justify-center items-center">
          <TabsList className="flex-wrap max-w-full h-max">
            <TabsTrigger value="rfq">Requests for Quotation</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="rfq">
          {/* Searching and filtering */}
          <div className="flex items-center justify-between flex-wrap gap-4 md:gap-8 w-full p-2.5 border shadow-md rounded-lg mb-4 dark:bg-secondary/50">
            <div className="flex items-center gap-4 w-max">
              <div className="relative">
                <Input
                  className="md:w-[300px] lg:w-[400px] pr-4"
                  placeholder="Search by staff name or unit"
                  defaultValue={searchParams.get("search")?.toString()}
                />
                <Button
                  variant="outline"
                  size={"icon"}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="">
                <FilterByYear defaultValue={searchParams.get("year")} />
              </div>
            </div>
            <div className="block w-max">
              {permissions?.create && (
                <Button>
                  <PlusIcon className="h-4 w-4" />
                  Create RFQ
                </Button>
              )}
            </div>
          </div>
          {/* DATA */}
          <RFQTable
            data={response as RFQ[]}
            isLoading={isLoading}
            user={props.user}
            permissions={permissions}
          />

          {(response as RFQ[]) &&
            permissions?.create &&
            (response as RFQ[]).length < 1 && (
              <div className="grid gap-2 pt-6 w-max">
                <AddRFQ text="+ Request for Quotation" user={props.user} />
              </div>
            )}
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <pre>
          <code>{JSON.stringify(permissions, null, 2)}</code>
        </pre>
      </div>
      {/* Additional content or RFQ list can be added here */}
    </>
  );
}
