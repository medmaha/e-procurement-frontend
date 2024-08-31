"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/Components/ui/select";
import { getQuotationResponse } from "../actions";

type Props = {
  children: ReactNode;
};

const CACHE = new Map();

export default function InitializePurchaseOrderCreation(props: Props) {
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState<{ id: ID; unique_id: string }[]>([]);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!isOpen) return;
    const cache_id = "quotations_";
    if (CACHE.has(cache_id)) return setData(CACHE.get(cache_id));
    const response = await getQuotationResponse();
    if (response.success) {
      return setData(() => {
        CACHE.set(cache_id, response.data);
        return response.data;
      });
    }
    toast.error(response.message);
  }, [isOpen]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      {isOpen && (
        <DialogContent className="max-w-[600px] text-sm">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              To create a purchase order you must first select a quotation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label className="font-semibold">Select Quotation</Label>
            <Select
              onValueChange={(value) => {
                if (!value) return;
                router.push(
                  `/procurement/purchase-orders/create?quotation=${value}`
                );
              }}
            >
              <SelectTrigger></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Choose a Quotation</SelectLabel>
                  {data.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.unique_id}
                    </SelectItem>
                  ))}
                  {data.length < 1 && (
                    <SelectItem disabled value="------" className="text-center">
                      There are currently no quotations to process
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-8 w-full">
            <DialogClose asChild className="w-full">
              <Button
                variant={"secondary"}
                className="w-full inline-flex gap-2 items-center"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
