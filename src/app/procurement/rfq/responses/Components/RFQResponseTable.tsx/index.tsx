"use client";
import TabularData from "@/Components/widget/TabularData";
import { columns } from "./column";
import { useMemo } from "react";

type Props = {
  user: AuthUser;
  data: RFQResponse[];
};
export default function RFQResponseTable({ data, user }: Props) {
  const bidsColumns = useMemo(() => {
    return columns(user);
  }, [user]);

  return <TabularData data={data} columns={bidsColumns} />;
}
