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
        <button
          className="inline-flex  items-center justify-center rounded-md h-8 w-8 transition-all bg-accent/50 hover:bg-accent/80"
          disabled={!hasPrev || currentSegment === "dashboard"}
          onClick={prevRoute}
        >
          <ChevronLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
      </Tooltip>
      <h2 className="font-semibold hidden md:inline-block">
        {title || "No Page Title"}
      </h2>
      <Tooltip content="Click to go forward">
        <button
          className="inline-flex  items-center justify-center rounded-md h-8 w-8 transition-all bg-accent/50 hover:bg-accent/80"
          disabled={!hasNext}
          onClick={nextRoute}
        >
          <ChevronRightIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
      </Tooltip>
    </div>
  );
}
