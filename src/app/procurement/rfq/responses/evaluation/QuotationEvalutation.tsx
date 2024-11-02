"use client";
import { Badge } from "@/Components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import Quantity from "./fields/Quantity";
import Pricing from "./fields/Pricing";
import Specs from "./fields/Specs";
import Rating from "./fields/Rating";
import SubmitButton from "./fields/SubmitButton";
import RemoveButton from "./fields/RemoveButton";
import Comment from "./fields/Comment";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

type Props = {
  updateReload: () => Promise<void>;
  item: RFQItem;
  user: AuthUser;
  loading: boolean;
  itemIndex: number;
  quotationIndex: number;
  quotation: RFQResponse;
  review: (data: RFQResponse) => void;
  setLoading: (loading: boolean) => void;
};

function getEvaluation(quotation: RFQResponse, item: RFQItem) {
  const evaluation = quotation.evaluation?.find((e) => e.item_id === item.id);
  return evaluation;
}

type updater = <T extends keyof QuoteEvaluation>(
  key: T,
  value: QuoteEvaluation[T]
) => void;

export default function RFQQuotationEvaluation({
  item,
  quotation,
  ...props
}: Props) {
  const [data, setData] = useState<QuoteEvaluation | undefined>(
    getEvaluation(quotation, item)
  );
  const submitted = useMemo(() => {
    return Boolean(quotation.evaluation?.find((e) => e.item_id === item.id));
  }, [quotation, item.id]);

  useEffect(() => {
    setData(getEvaluation(quotation, item));
  }, [quotation, item]);

  const updateData: updater = (key, value) => {
    setData((prev) => {
      if (!prev) {
        const evaluation = {} as QuoteEvaluation;
        return {
          ...evaluation,
          [key]: value,
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  function getDefaultValue<T extends keyof QuoteEvaluation>(key: T) {
    const _eval = quotation.evaluation?.find((e) => e.item_id === item.id)!;
    if (_eval) return _eval[key] as QuoteEvaluation[T];
    return undefined;
  }

  const isRejected = quotation.status.toLowerCase() == "rejected";

  return (
    <tr key={quotation.id}>
      <td>
        <small>{props.quotationIndex + 1}.</small>
      </td>
      <td>
        <div className="w-max">{quotation.vendor.name}</div>
      </td>
      <td>
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => props.review(quotation)}
        >
          Review
        </Button>
      </td>
      {/* <td>
				<Review data={quotation} user={user} />
			</td> */}
      {/* <td>
				<Quantity
					disabled={submitted}
					updateData={(value) => updateData("quantity", value)}
					defaultValue={getDefaultValue("quantity")}
				/>
			</td> */}
      <td>
        <Pricing
          isRejected={isRejected}
          disabled={submitted || isRejected}
          updateData={(value) => updateData("pricing", value)}
          defaultValue={getDefaultValue("pricing")}
        />
      </td>
      <td>
        <Input
          min={1}
          max={5}
          type="number"
          name="rating"
          className={`text-center w-[8ch] ${
            isRejected ? "cursor-not-allowed text-destructive" : ""
          }`}
          disabled={submitted || isRejected}
          onChange={(ev) => {
            if (!parseInt(ev.target.value)) return;
            updateData("rating", Number(ev.target.value));
          }}
          defaultValue={isRejected ? 0 : getDefaultValue("rating") || "1"}
        />
      </td>
      <td>
        <Specs
          isRejected={isRejected}
          disabled={submitted || isRejected}
          updateData={(value) => updateData("specifications", value)}
          defaultValue={getDefaultValue("specifications")}
        />
      </td>
      {/* <td>
				<Rating
					disabled={submitted}
					updateData={(rate: number) => updateData("rating", rate)}
					defaultValue={getDefaultValue("rating")}
				/>
			</td> */}
      <td>
        <Badge
          variant={isRejected ? "destructive" : "outline"}
          className="p-1 px-2"
        >
          <span className="capitalize">
            {isRejected ? "Rejected" : getDefaultValue("status") || "pending"}
          </span>
        </Badge>
      </td>
      <td>
        <div className="pl-2.5">
          <Comment
            isRejected={isRejected}
            disabled={submitted || isRejected}
            updateData={(comment: string) => updateData("comments", comment)}
            defaultValue={getDefaultValue("comments")}
          />
        </div>
      </td>

      <td className="">
        {!submitted &&
          (isRejected ? (
            <div className="p-1.5 md:font-semibold text-center rounded-md text-destructive bg-destructive/10 border-destructive border">
              Rejected RFQ
            </div>
          ) : (
            <SubmitButton
              disabled={submitted}
              quotation={quotation}
              rfqItem={item}
              updateReload={props.updateReload}
              data={data}
            />
          ))}
        {submitted && !isRejected && (
          <div className="inline-flex flex-1 justify-end">
            <RemoveButton
              quotation={quotation}
              rfqItem={item}
              updateReload={props.updateReload}
              data={data}
            />
          </div>
        )}
      </td>
    </tr>
  );
}
