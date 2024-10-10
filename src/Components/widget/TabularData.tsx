"use client";

import React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/ui/utils";

type Props<T> = {
  data?: T[];
  loading?: boolean;
  columns: ColumnDef<T>[];
  plane?: boolean;
  rowClassName?: string;
  headerClassName?: string;
  wrapperClassName?: string;
};

function TabularData<T = any>({ data, columns, loading, ...props }: Props<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable<T>({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className={cn("w-full min-h-[30svh] relative", props.wrapperClassName)}>
      <Table className="border-none w-full">
        <TableHeader className="md:h-[50px] h-[40px]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn(
                "p-0 bg-secondary/50",
                props.headerClassName,
                props.plane && "hover:bg-transparent bg-transparent"
              )}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-2 md:p-2.5 text-xs">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "p-0",
                    props.rowClassName,
                    props.plane && "hover:bg-transparent"
                  )}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2.5 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      {loading && (
        <div className="absolute z-10 flex items-center justify-center backdrop-blur-[2px] bottom-0 left-0 w-full md:h-[calc(100%-55px)] h-[calc(100%-45px)]">
          <Loader2 className="w-12 h-12 animate-spin dark:text-primary/50 text-primary stroke-[2px] md:stroke-[3px]" />
        </div>
      )}
      {!loading && table.getRowModel().rows?.length < 1 && (
        <p className="text-lg font-semibold underline underline-offset-8  text-muted-foreground p-4 pt-8 text-center">
          No Results Found!
        </p>
      )}
    </div>
  );
}

export default TabularData;
