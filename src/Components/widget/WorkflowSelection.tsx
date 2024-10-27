"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { actionRequest } from "@/lib/utils/actionRequest";
import { cn } from "@/lib/ui/utils";

type Props = {
  id?: string;
  name: string;
  authUserId?: ID;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export default function WorkflowSelection(props: Props) {
  const { name, disabled, required } = props;

  const [selectedWorkflow, setSelectedWorkflow] =
    useState<WorkflowInterface | null>(null);

  const workflowsQuery = useQuery({
    queryKey: ["workflows", props.authUserId],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await actionRequest<WorkflowInterface[]>({
        method: "get",
        url: "/procurement/requisitions/workflows/",
      });

      if (!response.success) throw response;

      if (props.defaultValue) {
        handleValueChange(props.defaultValue);
      }

      return response.data;
    },
  });

  function handleValueChange(workflow_id: string) {
    const workflow = workflowsQuery.data?.find(
      (workflow) => workflow.id.toString() === workflow_id?.toString()
    );
    setSelectedWorkflow(workflow || null);
  }

  return (
    <Select
      name={name}
      disabled={disabled}
      required={required}
      key={selectedWorkflow?.id}
      onValueChange={handleValueChange}
      defaultValue={selectedWorkflow?.id.toString()}
    >
      <SelectTrigger
        key={selectedWorkflow?.id}
        disabled={disabled}
        className={cn(
          "bg-background  text-sm disabled:pointer-events-none",
          props.triggerClassName,
          !selectedWorkflow && "text-muted-foreground"
        )}
      >
        {selectedWorkflow ? (
          <div className="">
            {selectedWorkflow.name}
            {" - "}
            <strong className="text-muted-foreground">
              ({selectedWorkflow.workflow_steps.length}{" "}
              {selectedWorkflow.workflow_steps.length > 1 ? "steps" : "Step"})
            </strong>{" "}
          </div>
        ) : (
          <SelectValue placeholder={props.placeholder || "Select an option"} />
        )}
      </SelectTrigger>
      <SelectContent className={cn("p-0 m-0 w-full", props.contentClassName)}>
        <SelectGroup className="m-0 p-1 space-y-1">
          <SelectLabel className="px-4">
            {workflowsQuery.data && workflowsQuery.data.length
              ? "Select a Workflow"
              : "No workflow found"}
            {workflowsQuery.isLoading && "Loading Staffs"}
          </SelectLabel>
          {workflowsQuery.data?.map((workflow) => {
            return (
              <SelectItem
                key={workflow.id}
                value={String(workflow.id)}
                className={cn(
                  "",
                  selectedWorkflow?.id === workflow.id && "bg-accent/50"
                )}
              >
                <div className="text-sm">
                  {workflow.name}
                  {workflow.description && (
                    <p className="truncate text-muted-foreground max-w-[70ch]">
                      <strong className="text-muted-foreground">
                        ({workflow.workflow_steps.length}{" "}
                        {workflow.workflow_steps.length > 1 ? "steps" : "Step"})
                      </strong>{" "}
                      <small>{workflow.description}</small>
                    </p>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
