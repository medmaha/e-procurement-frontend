"use client";

import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import AdditionDocUploader from "./AdditionDocUploader";
import ClientSitePage from "@/Components/ui/ClientSitePage";
import SubmitButton from "@/Components/widget/SubmitButton";
import SupplierSelect from "@/Components/widget/SupplierSelect";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ActionRespond } from "@/lib/utils/actionRequest";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { generate_unique_id } from "@/lib/helpers/generator";

type Props = {
  user: AuthUser;
  award_id?: ID;
  vendor_id?: ID;
  contract?: Contract;
  hideTitle?: boolean;
  onSuccess?: () => void;
  handleCreateContract: (formData: any) => Promise<ActionRespond<any, Json>>;
};

type Inputs = {
  title: string;
  description: string;
  supplier: string;
  start_date: string;
  end_date: string;
  award: string;
  payment_terms: string;
  delivery_schedule: string;
  terms_and_conditions: string;
  confidentiality: boolean;
  penalty: number;
  attachments: ContractAttachment[];
};

export default function CreateContainer(props: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { defaultValues, isSubmitting, isDirty },
  } = useForm<Inputs>({
    defaultValues: {
      ...props.contract,
      award: props.award_id
        ? generate_unique_id("AWD", props.award_id)
        : props.contract?.award
        ? generate_unique_id("AWD", props.contract?.award)
        : undefined,
      supplier:
        props.vendor_id?.toString() || props.contract?.supplier?.id.toString(),
    },
  });

  const router = useRouter();

  async function uploadFiles(attachments: ContractAttachment[] = []) {
    async function uploader(attachment: ContractAttachment) {
      const formData = new FormData();
      formData.append("file", (attachment as any).file as File);
      formData.append(
        "metadata",
        JSON.stringify({
          name: props.user.name,
          profile_id: props.user.profile_id,
          profile_type: props.user.meta.vendor ? "vendor" : "staff",
        })
      );

      const { data } = await axios.post<{ url: string }>(
        `${location.pathname}/upload`,
        formData
      );
      attachment.document_url = data.url;
      return attachment;
    }

    const promises = [] as Promise<ContractAttachment>[];

    for (const attachment of attachments.filter((a) => !!(a as any).file)) {
      promises.push(uploader(attachment));
    }

    const data = await Promise.all(promises);
    return data;
  }

  async function onSubmit(data: Inputs) {
    try {
      const _attachmentsSnapshot = data.attachments;
      const attachments = await uploadFiles(data.attachments);
      data.attachments = attachments.map(({ name, document_url }) => ({
        name,
        document_url,
      })) as any;
      const response = await props.handleCreateContract(data);
      if (response.success) {
        toast(
          response.message || !props.contract
            ? "Contract has been created."
            : "You contract has been updated successfully",
          {
            duration: 5_000,
            description: format(new Date(), "PPPPp"),
            action: !props.contract
              ? {
                  label: "View Details",
                  onClick: () =>
                    router.push(
                      `/procurement/contracts/drafts/${response.data.id}`
                    ),
                }
              : undefined,
          }
        );
        if (props.onSuccess) {
          props.onSuccess();
          router.refresh();
        }
      } else {
        //TODO: delete uploaded files

        // restore The data attachement
        data.attachments = _attachmentsSnapshot;

        toast(response.message || "Failed to create a contract", {
          duration: 5_000,
          className: "bg-destructive",
          description: format(new Date(), "PPPPp"),
          action: {
            label: "Retry",
            onClick: () => onSubmit(data),
          },
        });
      }
    } catch (error: any) {
      toast(error.message || "Failed to create a contract", {
        duration: 3_000,
        className: "bg-destructive",
        description: format(new Date(), "PPPPp"),
      });
    }
  }

  return (
    <>
      <Card className="max-w-[1000px] w-full pt-4 h-max mx-auto bg-card/50">
        {!props.hideTitle && (
          <div className="flex items-center flex-wrap justify-between  gap-4">
            <ClientSitePage
              page={{
                title: "New Contract Draft",
              }}
            />
            <CardHeader>
              <CardTitle>Create New Contract Draft</CardTitle>
              <CardDescription>
                Fill in the details for the new contract draft. You can save it
                and edit later.
              </CardDescription>
            </CardHeader>
            <Button size={"sm"} variant={"secondary"} className="sm:mr-5">
              <SaveIcon className="w-4 h-4" />
              Save Draft
            </Button>
          </div>
        )}
        <CardContent className="">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Title
                  <small className="ml-2 text-muted-foreground">
                    Identify your contract with a title
                  </small>
                </Label>
                <Input
                  id="title"
                  autoFocus
                  required
                  placeholder="Enter contract title"
                  {...register("title", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="description">
                  Description
                  <small className="ml-2 text-muted-foreground">
                    (Optional)
                  </small>
                </Label>
                <Textarea
                  id="description"
                  maxLength={500}
                  {...register("description")}
                  placeholder="Provide a detailed description of the contract"
                />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <SupplierSelect
                  defaultValue={defaultValues?.supplier}
                  onValueChange={(value) =>
                    setValue("supplier", value.toString())
                  }
                  id="supplier"
                />
              </div>
              <div>
                <Label htmlFor="award">
                  Award ID
                  <small className="ml-2 text-muted-foreground">
                    (Optional)
                  </small>
                </Label>
                <Input id="award" type="text" {...register("award")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">
                    Start Date
                    <small className="ml-2 text-muted-foreground">
                      (Optional)
                    </small>
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register("start_date")}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">
                    End Date
                    <small className="ml-2 text-muted-foreground">
                      (Optional)
                    </small>
                  </Label>
                  <Input id="end_date" {...register("end_date")} type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="payment_terms">
                  Payment Terms
                  <small className="ml-2 text-muted-foreground">
                    (Optional)
                  </small>
                </Label>
                <Textarea
                  id="payment_terms"
                  {...register("payment_terms")}
                  maxLength={500}
                  placeholder="Specify payment terms, schedules, and conditions"
                />
              </div>
              <div>
                <Label htmlFor="delivery_schedule">
                  Delivery Schedule
                  <small className="ml-2 text-muted-foreground">
                    (Optional)
                  </small>
                </Label>
                <Textarea
                  id="delivery_schedule"
                  {...register("delivery_schedule")}
                  maxLength={500}
                  placeholder="Detail the delivery timeline and milestones"
                />
              </div>
              <div>
                <Label htmlFor="terms_and_conditions">
                  Terms and Conditions
                  <small className="ml-2 text-muted-foreground">
                    (Optional)
                  </small>
                </Label>
                <Textarea
                  id="terms_and_conditions"
                  {...register("terms_and_conditions")}
                  maxLength={1000}
                  placeholder="Enter the contract terms and conditions"
                />
              </div>
              <div className="grid sm:grid-cols-[auto,1fr] items-center gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="confidentiality">
                    Confidentiality Clause
                    <small className="ml-2 text-muted-foreground">
                      (Optional)
                    </small>
                  </Label>
                  <div className="inline-flex gap-2 items-center flex-1">
                    <Switch
                      id="confidentiality"
                      defaultChecked={defaultValues?.confidentiality}
                      onCheckedChange={(checked) =>
                        setValue("confidentiality", checked)
                      }
                    />
                    <small className="text-muted-foreground">
                      Include a confidentiality clause in the contract
                    </small>
                  </div>
                </div>
                <div>
                  <Label htmlFor="penalty">
                    Penalty Amount
                    <small className="ml-2 text-muted-foreground">
                      (Optional)
                    </small>
                  </Label>
                  <Input
                    min="0"
                    id="penalty"
                    type="number"
                    {...register("penalty")}
                    placeholder="Enter penalty amount"
                  />
                </div>
              </div>
              {!props.contract && (
                <AdditionDocUploader
                  onDocumentsChange={(docs) =>
                    setValue("attachments", docs as any)
                  }
                />
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 pt-4">
              <Button
                disabled={isSubmitting}
                type="button"
                variant="secondary"
                className="md:font-semibold"
              >
                Cancel
              </Button>
              <SubmitButton
                disabled={isSubmitting || !isDirty}
                type="submit"
                className="md:font-semibold"
              >
                {props.contract ? "Update" : "Create"} Draft
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
