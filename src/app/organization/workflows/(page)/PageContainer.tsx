"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ApprovalSteps from "./tabs/ApprovalSteps";
import ApprovalMatrices from "./tabs/ApprovalMatrix";
import ApprovalWorkflows from "./tabs/ApprovalWorkflows";

type Props = {
  tab?: string;
  user: AuthUser;
};

export default function CreateContainer(props: Props) {
  const [state, setState] = useState({
    tab_1: null as any,
    tab_2: null as any,
    tab_3: null as any,
    tab_4: null as any,
  });

  function updateState(tab: string, value: any) {
    setState({ ...state, [tab]: value });
  }

  function handleTabChange(tab: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <Tabs
      defaultValue={props.tab || "workflows"}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="flex w-full justify-center items-center">
        <TabsList className="flex-wrap max-w-full h-max">
          <TabsTrigger value="approval-matrix">Approval Matrix</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="approval-steps">Approval Steps</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="approval-steps">
        <ApprovalSteps
          user={props.user}
          state={state.tab_2}
          updateState={updateState}
        />
      </TabsContent>

      <TabsContent value="workflows">
        <ApprovalWorkflows
          user={props.user}
          state={state.tab_4}
          updateState={updateState}
        />
      </TabsContent>

      <TabsContent value="approval-matrix">
        <ApprovalMatrices
          user={props.user}
          state={state.tab_3}
          updateState={updateState}
        />
      </TabsContent>
    </Tabs>
  );
}
