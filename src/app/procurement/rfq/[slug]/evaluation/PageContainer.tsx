"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Progress } from "@/Components/ui/progress";
import {
  Star,
  DollarSign,
  Package,
  Trophy,
  View,
  ViewIcon,
} from "lucide-react";
import { Button } from "@/Components/ui/button";

import { formatNumberAsCurrency } from "@/lib/helpers";
import { useMemo, useState } from "react";
import { AwardVendor } from "./Component/AwardVendor";
import { actionRequest } from "@/lib/utils/actionRequest";
import { toast } from "react-toastify";

type Props = {
  user: AuthUser;
  winners: Winners;
  data: RFQEvaluationRecord[];
  evaluation: RFQEvaluation;
};

export default function PageContainer({ data, winners, evaluation }: Props) {
  const topPerformers = useMemo(() => {
    return Object.entries(winners)
      .sort(
        ([, a], [, b]) =>
          b.winner_criteria.average_rating - a.winner_criteria.average_rating
      )
      .slice(0, 3);
  }, []);

  const [showAwardDialog, setShowAwardDialog] = useState<RFQEvaluationRecord>();

  const handleAwardVendor = async (closeAlertBox: any, data?: any) => {
    if (!showAwardDialog) return;

    const response = await actionRequest({
      method: "post",
      url: `/procurement/contracts/awards/`,
      data: {
        quotation: showAwardDialog.quotation.id,
        ...data,
      },
      pathname: location.pathname,
    });

    if (response.success) {
      toast.success("Vendor awarded successfully");
      closeAlertBox();
      window.location.reload();
      return;
    }

    toast.error(response.message);
  };

  const handleAward = async (record?: RFQEvaluationRecord) => {
    setShowAwardDialog(record);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Top Performers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topPerformers.map(([vendorName, data], index) => {
          const rating = data.winner_criteria.average_rating;
          return (
            <Card
              key={vendorName}
              className={index === 0 ? "border-primary" : ""}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{vendorName}</span>
                  {index === 0 && (
                    <Badge variant="default">Top Performer</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Rating</span>
                        <span className="text-sm font-medium">{rating}/5</span>
                      </div>
                      <Progress value={(rating / 5) * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center pt-2">
                    <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium">
                      Total Pricing:{" "}
                      {formatNumberAsCurrency(data.total_pricing)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">
                      Total Specs Met: {data.total_specs}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all-evaluations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-evaluations">All Evaluations</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all-evaluations">
          <EvaluationTable
            award={handleAward}
            rfq_id={evaluation.rfq.id}
            records={data}
          />
        </TabsContent>
        <TabsContent value="approved">
          <EvaluationTable
            award={handleAward}
            rfq_id={evaluation.rfq.id}
            records={data.filter((record) => record.status)}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <EvaluationTable
            award={handleAward}
            rfq_id={evaluation.rfq.id}
            records={data.filter((record) => !record.status)}
          />
        </TabsContent>
      </Tabs>

      {showAwardDialog && (
        <AwardVendor
          isOpen
          onClose={handleAward}
          vendor={{
            name: showAwardDialog.quotation.vendor.name || "",
            totalAmount: Number(showAwardDialog.pricing || 0),
            deliveryTime: showAwardDialog.quotation.delivery_date || "",
            rating: showAwardDialog.rating || 0,
          }}
          onAward={handleAwardVendor}
        />
      )}
    </>
  );
}

function EvaluationTable({
  records,
  rfq_id,
  award,
}: {
  rfq_id: ID;
  award: (record: RFQEvaluationRecord) => void;
  records: RFQEvaluationRecord[];
}) {
  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {record.quotation.vendor.name}
              </TableCell>
              <TableCell>{record.item.name}</TableCell>
              <TableCell>
                {formatNumberAsCurrency(record.pricing || 0)}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                  <span>{record.rating.toFixed(1)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className="uppercase" variant={"secondary"}>
                  {record.quotation.evaluation_status ===
                  "AWARD_AWAITING_APPROVAL"
                    ? "Pending Award"
                    : record.status
                    ? "Evaluated"
                    : "Rejected"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Button
                    size="sm"
                    variant="default"
                    disabled={
                      record.quotation.evaluation_status !== "EVALUATED"
                    }
                    className="flex items-center gap-2"
                    onClick={async () => {
                      record.quotation.evaluation_status === "EVALUATED" &&
                        award(record);
                    }}
                  >
                    <Trophy className="w-4 h-4" />
                    Award
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <ViewIcon className="w-4 h-4" />
                    Details
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
