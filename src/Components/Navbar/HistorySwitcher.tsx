"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Tooltip from "../ui/tooltip";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";
import { usePageStore } from "@/lib/store";

export default function HistorySwitcher({ user }: { user: AuthUser }) {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const [loaded, setLoaded] = useState(false);

  const { title } = usePageStore();

  const nextRoute = () => {
    if (!hasNext) return;
    router.forward();
  };

  const prevRoute = () => {
    if (!hasPrev) return;
    router.back();
  };

  const currentSegment = segments.at(-1);
  const hasNext = true;
  const hasPrev = true;

  return (
    <div className="flex items-center gap-2">
      <Tooltip content="Click to go back" contentClassName="translate-x-1/4">
        <Button
          className="rounded-md h-max w-max p-2"
          size={"icon"}
          disabled={!hasPrev || currentSegment === "dashboard"}
          variant={hasPrev ? "secondary" : "ghost"}
          onClick={prevRoute}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
      </Tooltip>
      <h2 className="font-semibold">{title || "No Page Title"}</h2>
      <Tooltip content="Click to go forward">
        <Button
          className="rounded-md h-max w-max p-2"
          size={"icon"}
          disabled={!hasNext}
          variant={hasNext ? "secondary" : "ghost"}
          onClick={nextRoute}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </Tooltip>
    </div>
  );
}
