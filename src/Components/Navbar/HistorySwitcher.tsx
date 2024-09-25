"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Tooltip from "../ui/tooltip";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import Link from "next/link";

export default function HistorySwitcher({ user }: { user: AuthUser }) {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const [history, setHistory] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  const nextRoute = () => {
    if (!hasNext) return;
    router.forward();
  };

  const prevRoute = () => {
    if (!hasPrev) return;
    router.back();
  };

  useEffect(() => {
    // check if segment is not within cached history
    if (!history.join("/").includes(segments.join("/"))) {
      setHistory(segments);
    }
    setLoaded(true);
  }, [segments]);

  const currentSegment = segments.at(-1);

  const hasNext = !loaded ? false : history.length > segments.length;
  const hasPrev = !loaded ? false : segments.length > 0;

  const lastThreeSegments =
    segments.length > 3 ? segments.slice(segments.length - 3) : segments;

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
      <h2 className="text-sm">
        {lastThreeSegments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const isCurrent = currentSegment === segment;

          const href = lastThreeSegments.slice(0, index + 1).join("/");

          return (
            <Link href={isCurrent ? "#" : `/${href}`} key={`/${segment}`}>
              <span
                className={
                  isCurrent ? " font-semibold" : "text-muted-foreground"
                }
              >
                {segment}
              </span>
              {!isLast && (
                <span className="text-muted-foreground px-0.5">/</span>
              )}
            </Link>
          );
        })}
      </h2>
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
