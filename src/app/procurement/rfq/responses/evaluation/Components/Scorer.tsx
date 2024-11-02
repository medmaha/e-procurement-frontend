"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { EvaluationContext } from "./Context";
import { Checkbox } from "@/Components/ui/checkbox";

const vendors = [
  {
    id: 1,
    name: "Company 1",
  },
  {
    id: 2,
    name: "Company 2",
  },
  {
    id: 3,
    name: "Company 3",
  },
];

export default function Scorer({ getWeight, data }: any) {
  const { factors, totalWeight, updateWeight } = useContext(EvaluationContext);
  return (
    <div className="table-wrapper w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Vendor Name</th>
            {factors.map((factor) => {
              return <th key={factor.id}>{factor.label}</th>;
            })}
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, i) => {
            return (
              <tr key={vendor.id}>
                <td>
                  <p className="text-base pl-2">{vendor.name} </p>
                </td>

                <VendorScore
                  totalWeight={totalWeight}
                  rowIndex={i}
                  factors={factors}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type Score = { value: number; id: string };

type Props2 = {
  totalWeight: number;
  rowIndex: number;
  factors: Factor[];
};

function VendorScore({ factors, totalWeight }: Props2) {
  const [scores, setScores] = useState<Score[]>([]);

  const totalScore = useMemo(() => {
    const isValid = () => {
      if (scores.length !== factors.length) return false;
      for (const score of scores) {
        if (score.value <= 0) return false;
        if (score.value > 5) return false;
        continue;
      }
      return true;
    };
    if (!isValid()) return 0;

    let _score = 0;
    for (let index = 0; index < scores.length; index++) {
      const score = scores[index];
      const weight = factors.find((f) => f.id === score.id)?.weight!;
      _score += (weight / 100) * score.value;
    }
    return _score;
  }, [factors, scores]);

  const update = (scores: Score[], factor: Factor, newValue: number) => {
    const score = Number(newValue);
    if (isNaN(score)) return;
    const existingScoreIndex = scores.findIndex(
      (score) => score.id === factor.id
    );

    if (existingScoreIndex !== -1) {
      // Update the existing score
      setScores((prevScores) => {
        const updatedScores = [...prevScores];
        updatedScores[existingScoreIndex].value = score;
        return updatedScores;
      });
    } else {
      // Add a new score to the array
      setScores((prevScores) => [
        ...prevScores,
        {
          id: factor.id,
          value: score,
        },
      ]);
    }
  };

  function getDefaultValue(_id: string) {
    return scores.find((s) => s.id === _id)?.value!;
  }

  let isInvalid = totalWeight !== 100;

  return (
    <>
      {factors?.map((factor: Factor, i: number) => (
        <td key={factor.id}>
          <input
            onInvalid={() => {}}
            disabled={isInvalid}
            type="number"
            min="1"
            max="5"
            defaultValue={getDefaultValue(factor.id)}
            placeholder="#"
            onChange={(e: any) =>
              update(scores, factor, parseInt(e.target.value))
            }
            className="w-[5ch] placeholder:text-center disabled:text-transparent text-center p-1 border text-lg rounded disabled:cursor-not-allowed disabled:bg-accent invalid:border-destructive"
          />
          {/* {factor.id == "specifications" ? (
						<div className="pl-4">
							<Checkbox
								className="p-4 disabled:bg-accent  disabled:cursor-not-allowed"
								disabled={isInvalid}
								defaultChecked={!!getDefaultValue(factor.id)}
								onCheckedChange={(checked) => {
									const isChecked = Boolean(checked.valueOf());
									if (isChecked) {
										update(scores, factor, 5);
										return;
									}
									update(scores, factor, 0);
								}}
							/>
						</div>
					) : (
						<input
							onInvalid={() => {}}
							disabled={isInvalid}
							type="number"
							min="1"
							max="5"
							defaultValue={getDefaultValue(factor.id)}
							placeholder="#"
							onChange={(e: any) =>
								update(scores, factor, parseInt(e.target.value))
							}
							className="w-[5ch] placeholder:text-center disabled:text-transparent text-center p-1 border text-lg rounded disabled:cursor-not-allowed disabled:bg-accent invalid:border-destructive"
						/>
					)} */}
        </td>
      ))}
      <>
        <td>
          <p className="text-base min-w-[70px]">
            {!isInvalid && totalScore.toFixed(2)}
          </p>
        </td>
      </>
    </>
  );
}
