"use client";
import { usePathname } from "next/navigation";
import React, { useContext, useLayoutEffect } from "react";
import { GlobalClientContext } from "@/Components/ClientLayout";
import { usePageStore } from "@/lib/store";

type Props = {
  page: {
    title: string;
    description?: string;
  };
};

export default function ClientSitePage(props: Props) {
  const { setTitle } = usePageStore();

  const pathname = usePathname();

  useLayoutEffect(() => {
    setTitle(props.page.title);
  }, [props.page, pathname]);

  return null;
}
