"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, EyeIcon } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
  user: AuthUser;
  workflows: WorkflowInterface[];
};

export default function Container({ user, workflows }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PR Approval Workflows</h1>
        <Link href="/organization/workflows/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Workflow
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="flex flex-col">
            <CardHeader className="">
              <CardTitle className="line-clamp-2 text-lg">
                {workflow.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                <p>Steps</p>
                <p>{workflow.workflow_steps?.length || 0}</p>
                <p>Author</p>
                <p>System Admin</p>
                <p>Last Modified</p>
                <p>{format(new Date(workflow.last_modified), "MMM d, yyyy")}</p>
              </div>
            </CardContent>
            <CardFooter className="p-2 justify-between gap-4">
              <Link href={`/organization/workflows/${workflow.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>

              <div className="inline-flex gap-2">
                <Link href={`/organization/workflows/${workflow.id}/edit/`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
