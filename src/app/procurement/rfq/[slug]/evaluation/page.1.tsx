import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import Page404 from "@/app/not-found";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { formatNumberAsCurrency } from "@/lib/helpers";
import { returnTo, searchParamsToSearchString } from "@/lib/server/urls";
import { actionRequest } from "@/lib/utils/actionRequest";
import { CheckCircle2, Crown, StarIcon, XCircle } from "lucide-react";
import React, { Fragment } from "react";
import Information from "./Component/Information";
import Rating from "./Component/Rating";
import { format } from "date-fns";
import GoBack from "@/Components/ui/GoBack";
import Link from "next/link";
import { generate_unique_id } from "@/lib/helpers/generator";

type Extras = {
  winners: Winners;
  evaluation: RFQEvaluation;
};

type PageData = {
  data: RFQEvaluationRecord[];
  extras: {
    winners: Winners;
    evaluation: RFQEvaluation;
  };
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

  const records = response.data;

  return (
    <section className="section">
      <div className="section-heading">
        <div className="grid items-start justify-start">
          <div className="pb-1">
            <GoBack />
          </div>
        </div>
        <div className="">
          <h1 className="heading-text">
            <span className="text-muted-foreground">
              ({generate_unique_id("RFQ", evaluation.rfq.id)})
            </span>{" "}
            Evaluation Result
          </h1>
          <p className="text-sm text-muted-foreground pt-1.5">
            Date Created:{" "}
            <span className="font-semibold">
              {format(new Date(evaluation.created_date), "PPPPp")}
            </span>
          </p>
        </div>
      </div>
      <div className="table-wrapper mb-4 md:mb-8">
        <table className="table w-full text-sm">
          <thead className="h-[50px]">
            <tr>
              <th>Vendor Name</th>
              <th>Item Description</th>
              <th>Bid Price</th>
              <th>Compliance</th>
              <th>Date Evaluated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              return (
                <tr key={record.id} className="last-child:border-0 h-[50px]">
                  <td>{record.quotation.vendor.name}</td>
                  <td>{record.item.name}</td>
                  <td>D{formatNumberAsCurrency(record.pricing)}</td>
                  <td>
                    {record.specifications ? (
                      <Badge variant={"success"} className="gap-2">
                        <CheckCircle2 width={16} height={16} />
                        <span>Yes</span>
                      </Badge>
                    ) : (
                      <Badge variant={"destructive"} className="gap-2">
                        <XCircle width={16} height={16} />
                        <span>No</span>
                      </Badge>
                    )}
                  </td>
                  {/* <td className="!px-2 md:!px-4">
										<div className="inline-flex item-center gap-1">
											<Rating length={record.rating} width={12} />
										</div>
									</td> */}
                  <td>
                    <p className="text-sm">
                      {format(record.created_date, "PPPp")}
                    </p>
                  </td>
                  <td>
                    <div className="inline-flex item-center gap-2 w-max">
                      <Information data={record} evaluation={evaluation} />
                      <Link
                        href={`/procurement/rfq/contracts/create?m_id=${record.quotation.id}&rfq=${evaluation.rfq.id}`}
                      >
                        <Button className="gap-2" size={"sm"}>
                          Award
                          <Crown
                            className="text-yellow-400 dark:text-primary-foreground"
                            width={14}
                            height={14}
                          />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="section-content !p-6 md:!p-8">
        <h3 className="text-2xl font-semibold pb-4 inline-flex items-center gap-1 flex-wrap">
          Recommended Winner{" "}
          <span className="inline-block pl-6">
            <Crown className="text-yellow-400 text-2xl" />
          </span>{" "}
        </h3>
        <div className="grid grid-cols-2 gap-5">
          {Object.keys(winners)
            .slice(0, 1)
            .map((vendor_name) => {
              const winner = winners[vendor_name];
              return (
                <Fragment key={vendor_name}>
                  <p className="">Winner</p>
                  <p className="font-semibold">{vendor_name}</p>
                  {/* <p className="">Average Score</p> */}
                  {/* <p className="inline-flex items-center gap-1">
										<Rating
											width={16}
											length={winner.winner_criteria.average_rating}
										/>
									</p> */}
                  <p className="">Average Bid Price</p>
                  <p className="text-right md:text-left">
                    D
                    {formatNumberAsCurrency(
                      winner.winner_criteria.average_pricing
                    )}
                  </p>
                  <p className="">Specification of Compliance</p>
                  <div className="text-right md:text-left">
                    {winner.winner_criteria.total_specs ? (
                      <Badge variant={"success"} className="gap-2">
                        <CheckCircle2 width={16} height={16} />
                        <span>Yes</span>
                      </Badge>
                    ) : (
                      <Badge variant={"destructive"} className="gap-2">
                        <XCircle width={16} height={16} />
                        <span>No</span>
                      </Badge>
                    )}
                  </div>
                  <div className="sm:col-span-2_ sm:pl-12 sm:pt-8">
                    <div className="max-w-[400px] mx-auto p-2 pt-4">
                      <Link
                        href={`/procurement/rfq/contracts/create?m_id=${winner.rfq_response_id}&rfq=${evaluation.rfq.id}`}
                      >
                        <Button
                          className="font-semibold gap-2 w-full"
                          size={"sm"}
                        >
                          Award Winner
                          <Crown
                            className="text-yellow-400 dark:text-primary-foreground"
                            width={14}
                            height={14}
                          />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>
      {/* <pre>
				<code>{JSON.stringify(evaluation, null, 4)}</code>
			</pre>
			<br />
			<pre>
				<code>{JSON.stringify(winners[0], null, 4)}</code>
			</pre> */}
    </section>
  );
}
