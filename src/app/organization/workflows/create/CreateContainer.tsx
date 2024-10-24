"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardFooter,
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ApprovalSteps from "./tabs/ApprovalSteps";
import ApprovalMatrices from "./tabs/ApprovalMetrix";
import WorkflowCreator from "./tabs/Workflow";

type Props = {
  user: AuthUser;
};

export default function CreateContainer(props: Props) {

  const [state, setState] = useState({
    tab_1: null as any,
    tab_2: null as any,
    tab_3: null as any,
  })

  function updateState(tab: string, value: any) {
    setState({ ...state, [tab]: value });
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Tabs defaultValue="workflow" className="w-full">
        <TabsList>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="approval-steps">Approval Steps</TabsTrigger>
          <TabsTrigger value="approval-matrix">Approval Matrix</TabsTrigger>
        </TabsList>
        <TabsContent value="workflow">
          <WorkflowCreator user={props.user} state={state.tab_1} updateState={updateState}/>
        </TabsContent>

        <TabsContent value="approval-steps">
          <ApprovalSteps user={props.user} state={state.tab_2} updateState={updateState}/>
        </TabsContent>

        <TabsContent value="approval-matrix">
          <ApprovalMatrices user={props.user} state={state.tab_3} updateState={updateState}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
