import React from "react";
import PageContainer from "./PageContainer";
import ClientSitePage from "@/Components/ui/ClientSitePage";

export default function page() {
  return (
    <section className="section">
      <ClientSitePage
        page={{
          title: "Contract Drafts",
        }}
      />
      <PageContainer />
    </section>
  );
}
