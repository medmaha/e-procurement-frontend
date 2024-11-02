"use client";
import { format, formatDistance, formatDistanceToNow } from "date-fns";
import { Check, X } from "lucide-react";
import React, { useLayoutEffect, useMemo, useState } from "react";

import {
  CalendarIcon,
  ClockIcon,
  FileIcon,
  UserIcon,
  BuildingIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  DownloadIcon,
  EyeIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import OpenedBy from "@/Components/widget/OpenedBy";
import { formatNumberAsCurrency } from "@/lib/helpers";
import APP_COMPANY from "@/APP_COMPANY";
import { generate_unique_id } from "@/lib/helpers/generator";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";

type Props = {
  user: AuthUser;
  data: RFQResponse;
  hideStatus?: boolean;
  autoFocus?: boolean;
  onClose?: () => void;
};

export default function ViewRFQResponse(props: Props) {
  const [isOpen, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (props.autoFocus) {
      setOpen(true);
    }
  }, [props.autoFocus]);

  const quotationQuery = useQuery({
    enabled: false,
    queryKey: ["rfq-responses", props.data.id],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const response = await actionRequest<RFQResponse>({
        method: "get",
        url: `/procurement/rfq/responses/${props.data.id}`,
      });
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });

  const data = useMemo(() => {
    return {
      ...props.data,
      ...quotationQuery.data,
    };
  }, [props.data, quotationQuery.data]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(opened) => {
        setOpen(opened);
        if (!opened) props.onClose?.();
      }}
    >
      <DialogTrigger asChild className="">
        <Button
          variant={"secondary"}
          size={"sm"}
          className="font-semibold text-xs"
        >
          Browse Quotation
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-[95%] 2xl:max-w-[1200px]
				w-full max-h-[95dvh] overflow-hidden overflow-y-auto border-2 shadow-xl`}
      >
        {isOpen && <RFQDetails rfqResponse={data} />}
      </DialogContent>
    </Dialog>
  );
}

type Props2 = {
  user: AuthUser;
  data: RFQResponse;
  hideOPenedBy?: boolean;
  hideStatus?: boolean;
  autoFocus?: boolean;
};

export function RFQResponseContent(props: Props2) {
  return (
    <>
      {/* HEADING */}
      <div className="flex justify-between gap-4 pr-8">
        <div className="text-sm">
          {/* <p>
								From: <b className="font-semibold">{APP_COMPANY.name}</b>
							</p> */}
          <p>
            FROM: <b className="text-lg pl-1">{props.data.vendor.name}</b>
          </p>
          <div className="pt-1 space-y-1">
            {/* <p className="text-sm text-muted-foreground">
								Authorized by:{" "}
								<b className="pl-2">{props.data.quotation.officer?.name}</b>
							</p> */}
            <p className="text-sm text-muted-foreground">
              Invited Date:{" "}
              <b className="pl-2">{format(props.data.created_date, "PP")}</b>
            </p>
            <p className="text-sm text-muted-foreground">
              Deadline Date:{" "}
              <b className="pl-2">{format(props.data.deadline, "PP")}</b>
            </p>
          </div>
        </div>
        {!props.hideStatus && (
          <div className="text-center">
            <p className="font-semibold w-full text-xl">
              {props.data.rfq.title}
            </p>
            {props.data.status.toLowerCase() === "approved" && (
              <p className="text-green-500 text-center pt-4 text-sm border-green-500 tracking-wide font-semibold inline-flex items-center gap-2">
                <Check width={14} />
                <span>Responded</span>
              </p>
            )}
            {props.data.status.toLowerCase() === "rejected" && (
              <p className="text-destructive text-center pt-4 text-sm border-green-500 tracking-wide font-semibold inline-flex items-center gap-2">
                <X width={14} />
                <span>DECLINED</span>
              </p>
            )}
          </div>
        )}
        <div className="grid">
          <p>
            TO: <b className="text-lg pl-1">{APP_COMPANY.name}</b>
          </p>
          <div className="text-sm">
            <p className="text-sm text-muted-foreground">
              RFQ No:{" "}
              <b className="pl-2">
                {generate_unique_id("RFQ", props.data.rfq.id)}
              </b>
            </p>
            <p className="text-sm text-muted-foreground">
              Respond Date:{" "}
              <b className="pl-2">{format(props.data.created_date, "PP")}</b>
            </p>
          </div>
        </div>
      </div>
      <div className="dark:bg-card space-y-4 dark:sm:p-4 dark:p-2">
        {/* Pricing, Payment, Delivery, Validity */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-[auto,1fr,1fr,1fr] gap-x-6 gap-4 pt-4 pb-2">
          {/* Total Price */}
          <div className="md:w-[100px] lg:w-[200px]">
            <div className="grid">
              <Label className="font-semibold text-lg">Total Price (GMD)</Label>
              <p className="text-lg font-semibold underline-offset-4 underline text-sky-500">
                D{formatNumberAsCurrency(props.data.pricing)}
              </p>
            </div>
          </div>
          {/* Validity Period */}
          <div className="grid gap-1">
            <Label className="font-semibold">Validity Period</Label>
            <p className="border p-2 rounded-md text-sm">
              {format(props.data.validity_period, "PPP")}
            </p>
          </div>
          {/* Delivery Terms */}
          <div className="grid gap-1">
            <Label className="font-semibold">Delivery Terms</Label>
            <p className="border p-2 rounded-md">{props.data.delivery_terms}</p>
          </div>
          {/* Payment Method */}
          <div className="grid gap-1">
            <Label className="font-semibold">Payment Method</Label>
            <p className="border p-2 rounded-md">{props.data.payment_method}</p>
          </div>
        </div>
        {/* FILES */}
        <div className="grid sm:grid-cols-2 gap-x-6 gap-4 pt-4">
          <div className="grid gap-1">
            <Label className="font-semibold pb-1" htmlFor="proforma">
              Proforma
            </Label>
            {props.data.proforma && (
              <a
                href={props.data.proforma}
                target="_blank"
                className="truncate capitalize inline-block w-full p-2 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground"
              >
                {props.data?.proforma?.split("/").at(-1)?.replace(".", " - ")}
              </a>
            )}
            {!props.data.proforma && (
              <a className="truncate inline-block w-full p-2 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground">
                No file included
              </a>
            )}
          </div>

          <div className="grid gap-1">
            <Label className="font-semibold pb-1">Form-101</Label>
            {props.data.form101 && !props.data.form101.match(/undefined/gi) && (
              <a
                href={props.data.form101}
                target="_blank"
                className="truncate capitalize inline-block w-full p-2 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground"
              >
                {props.data?.form101
                  ?.split("/")
                  .at(-1)
                  ?.replace(/(\.|\.\w{0,})/gi, " - ")}
              </a>
            )}
            {!props.data.form101 ||
              (props.data.form101.match(/undefined/gi) && (
                <a className="truncate inline-block w-full p-2 outline-2 outline outline-secondary rounded-md text-muted-foreground">
                  N/A
                </a>
              ))}
          </div>
        </div>

        {/* Brochures */}
        {props.data.brochures?.length > 0 && (
          <>
            {props.data.brochures.map((brochure, index) => {
              return (
                <div className="grid gap-1" key={brochure.id}>
                  <Label className="font-semibold pb-1">
                    (Brochures) {brochure.name}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <a
                      href={brochure.file}
                      target="_blank"
                      className="truncate capitalize inline-block w-full p-1.5 hover:bg-secondary transition outline-2 outline outline-secondary rounded-md text-muted-foreground"
                    >
                      {`${index + 1}. ${brochure.file}`}
                    </a>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* REMARKS */}
        <div className="grid gap-2 ">
          <Label className="font-semibold ">Comment / Remarks</Label>
          <p className="p-2 leading-relaxed tracking-wide border rounded-md text-sm min-h-[100px] max-h-[250px] overflow-hidden overflow-y-auto w-full">
            {props.data.remarks}
          </p>
        </div>
        {/* Opened By */}
        {checkOpenBy(props.hideOPenedBy) && (
          <div className="grid gap-2 ">
            <OpenedBy labelClass="text-sm" rfq_id={props.data.rfq.id} />
          </div>
        )}
      </div>
    </>
  );
}

function checkOpenBy(hideOPenedBy?: boolean) {
  if (!hideOPenedBy) return true;
  return false;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
    case "accepted":
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    case "rejected":
      return <XCircleIcon className="w-5 h-5 text-red-600" />;
    default:
      return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />;
  }
};

const RFQDetails: React.FC<{ rfqResponse: RFQResponse }> = ({
  rfqResponse,
}) => {
  function downloadDocument(href?: string) {
    if (!href) return;
    const link = document.createElement("a");
    link.href = "";
    link.setAttribute("download", href);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center space-y-0 pt-0 p-2 pb-4 border-b">
        <Badge className={`text-sm ${getStatusColor(rfqResponse.status)}`}>
          {rfqResponse.status.charAt(0).toUpperCase() +
            rfqResponse.status.slice(1)}
        </Badge>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div>
            <h3 className="text-lg font-semibold mb-2">General Information</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-muted-foreground">
                RFQ ID
              </dt>
              <dd className="text-sm">
                {generate_unique_id("RFQ", rfqResponse.rfq.id)}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Quotation ID
              </dt>
              <dd className="text-sm">
                {generate_unique_id("QR", rfqResponse.id)}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Responded At
              </dt>
              <dd className="text-sm flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(rfqResponse.created_date), "PPp")}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Deadline
              </dt>
              <dd className="text-sm flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                {format(new Date(rfqResponse.deadline), "PPP")}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Invited At
              </dt>
              <dd className="text-sm flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(rfqResponse.rfq.published_at), "PPp")}
              </dd>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Vendor Information</h3>
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={rfqResponse.vendor.name}
                />
                <AvatarFallback>
                  {rfqResponse.vendor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{rfqResponse.vendor.name}</p>
                <p className="text-sm text-muted-foreground">
                  Vendor ID: {rfqResponse.vendor.id.toString()}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-muted-foreground">
                Delivery Date
              </dt>
              <dd className="text-sm">
                {format(new Date(rfqResponse.delivery_date), "PP")}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Delivery Terms
              </dt>
              <dd className="text-sm">{"Active when awarded"}</dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Payment Method
              </dt>
              <dd className="text-sm">
                {rfqResponse.payment_method || "Not specified"}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Pricing
              </dt>
              <dd className="text-sm">
                {formatNumberAsCurrency(rfqResponse.pricing)}
              </dd>
              <dt className="text-sm font-medium text-muted-foreground">
                Validity Period
              </dt>
              <dd className="text-sm">
                {formatDistanceToNow(new Date(rfqResponse.delivery_date), {
                  addSuffix: true,
                  includeSeconds: false,
                })}
              </dd>
            </dl>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="text-lg font-semibold mb-4">RFQ Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>M-Unit</TableHead>
                <TableHead>Evaluation Criteria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqResponse.rfq.items?.map((item) => (
                <TableRow key={item.id.toString()}>
                  <TableCell>{item.item_description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.measurement_unit}</TableCell>
                  <TableCell>
                    {item.eval_criteria || "No evaluation criteria"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Proforma</span>

                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => downloadDocument(rfqResponse.proforma)}
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </div>
              {rfqResponse.form101 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Form 101</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => downloadDocument(rfqResponse.form101)}
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {rfqResponse.brochures.map((brochure) => (
                <div
                  key={brochure.id.toString()}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{brochure.name}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => downloadDocument(brochure.file)}
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Approval Information</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-muted-foreground">
                Approval Status
              </dt>
              <dd className="text-sm">
                <Badge className={getStatusColor(rfqResponse.approved_status)}>
                  {rfqResponse.approved_status}
                </Badge>
              </dd>
              {rfqResponse.approved_date && (
                <>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Approved Date
                  </dt>
                  <dd className="text-sm flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(rfqResponse.approved_date), "PPP")}
                  </dd>
                </>
              )}
              {rfqResponse.approved_officer && (
                <>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Approved By
                  </dt>
                  <dd className="text-sm flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {rfqResponse.approved_officer.name}
                  </dd>
                </>
              )}
            </dl>
            {rfqResponse.approved_remarks && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Approval Remarks
                </h4>
                <p className="text-sm">{rfqResponse.approved_remarks}</p>
              </div>
            )}
          </div>
        </div>

        {rfqResponse.evaluation && rfqResponse.evaluation.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-lg font-semibold mb-4">Evaluation</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criteria</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Max Score</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqResponse.evaluation.map((_eval) => (
                    <TableRow key={_eval.id.toString()}>
                      <TableCell>{_eval.item_id}</TableCell>
                      <TableCell>{_eval.rating}</TableCell>
                      <TableCell>{_eval.pricing}</TableCell>
                      <TableCell>{_eval.specifications}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {rfqResponse.remarks && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Remarks</h3>
              <p className="text-sm text-muted-foreground">
                {rfqResponse.remarks}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};
