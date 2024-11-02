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
import { Star, DollarSign, Package, Trophy } from "lucide-react";
import { Button } from "@/Components/ui/button";

import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { returnTo, searchParamsToSearchString } from "@/lib/server/urls";
import { actionRequest } from "@/lib/utils/actionRequest";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { generate_unique_id } from "@/lib/helpers/generator";
import Link from "next/link";
import PageContainer from "./PageContainer";

type Extras = {
  winners: Winners;
  evaluation: RFQEvaluation;
};

export default async function Page(props: PageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return returnTo(
      "/account/login",
      `/procurement/rfq/${props.params.slug}/evaluation`,
      props.searchParams
    );
  }

  const searchString = searchParamsToSearchString(props.searchParams);
  const response = await actionRequest<RFQEvaluationRecord[], Extras>({
    method: "get",
    url:
      `/procurement/rfq/evaluation/retrieve/${props.params.slug}/` +
      searchString,
  });

  if (!response.success) {
    return <Page404 error={response} />;
  }

  const winners = response.extras.winners;
  const evaluation = response.extras.evaluation;

  // Calculate winners from evaluation records
  // const winners = response.data.reduce(
  //   (acc, record) => {
  //     const vendorName = record.quotation.vendor.name;
  //     if (!acc[vendorName]) {
  //       acc[vendorName] = {
  //         winner_criteria: {
  //           average_rating: 0,
  //           total_ratings: 0,
  //         },
  //         total_pricing: 0,
  //         total_specs: 0,
  //       };
  //     }

  //     acc[vendorName].winner_criteria.total_ratings++;
  //     acc[vendorName].winner_criteria.average_rating += record.rating;
  //     acc[vendorName].total_pricing += Number(record.pricing);
  //     // Assuming a record with status true means specs were met
  //     if (record.status) {
  //       acc[vendorName].total_specs++;
  //     }

  //     return acc;
  //   },
  //   {} as Record<
  //     string,
  //     {
  //       winner_criteria: {
  //         average_rating: number;
  //         total_ratings: number;
  //       };
  //       total_pricing: number;
  //       total_specs: number;
  //     }
  //   >
  // );

  // Calculate final average ratings
  // Object.values(winners).forEach((vendor) => {
  //   vendor.winner_criteria.average_rating /=
  //     vendor.winner_criteria.total_ratings;
  // });

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">RFQ Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                RFQ ID
              </p>
              <p className="text-lg font-semibold">
                {generate_unique_id("RFQ", evaluation.rfq.id)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Officer
              </p>
              <p className="text-lg font-semibold">{evaluation.officer.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created Date
              </p>
              <p className="text-lg font-semibold">
                {new Date(evaluation.created_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Modified
              </p>
              <p className="text-lg font-semibold">
                {new Date(evaluation.last_modified).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PageContainer
        user={user}
        winners={winners}
        data={response.data}
        evaluation={evaluation}
      />
    </div>
  );
}

function EvaluationTable({
  records,
  rfq_id,
}: {
  rfq_id: ID;
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
                <Badge variant={record.status ? "success" : "destructive"}>
                  {record.status ? "Approved" : "Rejected"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={async () => {
                    // try {
                    //   const response = await actionRequest({
                    //     method: "post",
                    //     url: `/procurement/rfq/evaluation/award/${record.id}/`,
                    //   });
                    //   if (response.success) {
                    //     // Optionally refresh the page or show success message
                    //     window.location.reload();
                    //   }
                    // } catch (error) {
                    //   console.error("Failed to award contract:", error);
                    // }
                    alert("World Software");
                  }}
                >
                  <Trophy className="w-4 h-4" />
                  Award
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
