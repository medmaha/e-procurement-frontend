"use client";

import TabularData from "@/Components/widget/TabularData";
import { columns } from "./column";
import { useMemo } from "react";

type Props = {
  user: AuthUser;
  data: RFQ[];
};
export default function RFQTable({ data, user }: Props) {
  const rfqColumns = useMemo(() => {
    return columns(user);
  }, [user]);

  return <TabularData data={data} loading={false} columns={rfqColumns} />;
}
