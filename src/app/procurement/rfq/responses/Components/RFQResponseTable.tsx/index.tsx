"use client";
import TabularData from "@/Components/widget/TabularData";
import { columns } from "./column";

type Props = {
	user: AuthUser;
	data: RFQResponse[];
};
export default function RFQResponseTable({ data, user }: Props) {
	return <TabularData data={data} user={user} columns={columns} />;
}
