"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { generate_unique_id } from "@/lib/helpers/generator";
import { Badge } from "@/Components/ui/badge";
import ViewRequisitionDetails from "./RequisitionDetails";
import { format } from "date-fns";
// import { RequisitionDetails } from './requisition-details'

type Props = {
  readonly user: AuthUser;
  readonly requisitions: Requisition[];
};

export default function RequisitionsTable({ user, requisitions }: Props) {
  const [selectedRequisition, setSelectedRequisition] =
    useState<Requisition | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequisitions = requisitions.filter(
    (req) =>
      req.unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.officer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        <div className="w-full ">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Officer</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Sum</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequisitions.map((req) => (
                <TableRow
                  key={req.id}
                  onClick={() => setSelectedRequisition(req)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <p className="text-xs w-max">
                      {generate_unique_id("REQ", req.id)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs w-max">{req.request_type}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs w-max">{req.officer.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs w-max">{req.officer.unit.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        req.approval_status?.toLowerCase() === "approved"
                          ? "success"
                          : "outline"
                      }
                    >
                      <p className="text-xs w-max capitalize">
                        {req.approval_status || req.approval.status}
                      </p>
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs w-max">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "GMD",
                        maximumFractionDigits: 2,
                      }).format(
                        req.items.reduce((a, b) => {
                          a += Number(b.unit_cost);
                          return a;
                        }, 0)
                      )}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs w-max">
                      {req.items.length}
                      &nbsp;
                      <span className="text-muted-foreground">
                        {req.items.length > 1 ? "items" : "item"}
                      </span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs w-max">
                      {format(new Date(req.created_date), "PPp")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs w-max">
                      {format(new Date(req.last_modified), "Pp")}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full md:w-1/3">
          {selectedRequisition && (
            <ViewRequisitionDetails
              user={user}
              defaultOpen
              onClose={() => setSelectedRequisition(null)}
              requisition={selectedRequisition}
            />
          )}
        </div>
      </div>
    </>
  );
}
