import { getAuthenticatedUser } from "@/lib/auth/generics";
import { returnTo } from "@/lib/server/urls";
import PageContainer from "./PageContainer";

export const metadata = {
  title: "RFQ | E-Procurement",
  description: "E-procurement site offered by IntraSoft Ltd",
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo("/account/login", `/procurement/rfq`, props.searchParams);
  }

  return (
    <section className="section">
      <PageContainer user={user} searchParams={props.searchParams} />
    </section>
  );
}
