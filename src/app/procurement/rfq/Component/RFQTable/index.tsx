"use client";

import TabularData from "@/Components/widget/TabularData";
import { columns } from "./column";

type Props = {
	user: AuthUser;
	data: RFQ[];
};
export default function RFQTable({ data, user }: Props) {
	return <TabularData data={data} user={user} columns={columns} />;
}
