"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import SubmitButton from "@/Components/widget/SubmitButton";
import CACHE from "@/lib/caching";
import {
  approveRequisition,
  getDepartmentProcurementPlanItems,
} from "../actions";
import { RequisitionDetails } from "./RequisitionDetails";
import ViewDepartmentPlans from "./ViewDepartmentPlans";
import ActionConfirmation from "@/Components/ActionConfirmation";

type Props = {
  user: AuthUser;
  from?: "Unit" | "Department" | "Finance" | "Procurement";
  requisition: Requisition;
  children: ReactNode;
  department: any;
};

export default function Approval({
  user,
  children,
  requisition,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(requisition);

  const onRequisitionFetch = useCallback((payload: Requisition) => {
    setData((data) => {
      return { ...data, ...payload };
    });
  }, []);

  useEffect(() => {
    setData(requisition);
  }, [requisition]);

  if (!requisition.approval.apposable) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[1200px] mx-auto p-0">
        <DialogHeader className="px-6 pt-4 border-b pb-2">
          <DialogTitle className="text-xl sm:text-2xl capitalize">
            {requisition.approval.stage} Requisition Approval
          </DialogTitle>
          <DialogDescription>
            Please review the requisition details below and use the provided
            options to either approve or reject the requisition.
          </DialogDescription>
        </DialogHeader>
        {isOpen && (
          <div className="max-h-[80dvh] overflow-hidden overflow-y-auto px-6">
            <RequisitionDetails
              onRequisitionFetch={onRequisitionFetch}
              data={data}
              user={user}
            />
            <ApprovalForm
              department={props.department}
              data={data?.approval}
              user={user}
              officer={requisition.officer}
              isOpen={isOpen}
              closeDialog={() => {
                setIsOpen(false);
                CACHE.delete(String(requisition.id));
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type Props3 = {
  user: AuthUser;
  officer: any;
  data: RequisitionApproval;
  closeDialog: () => void;
  isOpen: boolean;
  department: any;
};

function getUserApprovalFields(
  stage: RequisitionApproval["stage"],
  _data: Json
) {
  const data = {
    approve: _data["approve"] ?? "NO",
    remark: _data["remark"],
  } as Json;

  switch (stage) {
    case "Procurement":
      return {
        ...data,
        part_of_annual_plan: !!_data["part_of_annual_plan"],
        annual_procurement_plan: _data["annual_procurement_plan_id"],
      };
    case "Finance":
      return {
        ...data,
        funds_confirmed: !!_data["funds_confirmed"],
      };
    default:
      return data;
  }
}

function ApprovalForm({ user, data, officer, isOpen, ...props }: Props3) {
  async function submitForm(formData: FormData, action: "approve" | "reject") {
    const json = Object.fromEntries(formData.entries());
    json["approve"] = action === "approve" ? "on" : "No";
    const response = await approveRequisition(
      {
        approval_id: data.id,
        [data.stage.toLowerCase()]: getUserApprovalFields(data.stage, json),
      },
      location.pathname
    );

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    props.closeDialog();
    toast.success(response.message);
  }
  return (
    <>
      <h3 className="font-semibold text-xl pt-2 pb-4 text-center border-y">
        Approval Form
      </h3>
      <form className="block w-full">
        <input hidden name="approval_id" defaultValue={data.id} />
        <div className="grid grid-cols-4 w-full gap-4 pt-4">
          {data.stage === "Finance" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="funds_confirmed">Funds Confirmed</Label>
                <Switch id="funds_confirmed" name="funds_confirmed" />
              </div>
              <div className="grid">
                <div className="grid gap-1">
                  <Label>Department Plans</Label>
                  <ViewDepartmentPlans
                    department={props.department}
                    requisition_id={data.id}
                  >
                    <Button
                      variant={"secondary"}
                      className="h-max p-1.5 w-[100px] font-semibold"
                    >
                      View Plans
                    </Button>
                  </ViewDepartmentPlans>
                </div>
              </div>
            </>
          )}

          {data.stage === "Procurement" && (
            <>
              <DepartmentProcurementPlans officer={officer} />
              <div className="flex justify-end">
                <div className="grid">
                  <Label>Department Plans</Label>
                  <ViewDepartmentPlans
                    department={props.department}
                    requisition_id={data.id}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="grid grid-cols-3 pt-2 gap-4">
          <div className="grid gap-2 col-span-2">
            <Label htmlFor="remark">Remark</Label>
            <Textarea
              id="remark"
              name="remark"
              placeholder="Add a remark... (optional)"
            ></Textarea>
          </div>
          <div className="flex pt-5 justify-center flex-col">
            <div className="grid">
              <p className="leading-none font-semibold">Officer</p>
              <p className="text-muted-foreground text-sm">{user.name}</p>
            </div>
            <div className="grid pt-1">
              <p className="leading-none font-semibold">Date</p>
              <p className="text-muted-foreground text-sm">
                {new Date().toLocaleDateString(locale)}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-8 p-6 flex max-sm:flex-wrap justify-center items-center gap-5 max-w-[400px] w-full mx-auto">
          <ActionConfirmation
            title="Reject Requisition"
            description={
              <span className="inline-block pb-4">
                Are you sure you want to reject this requisition?
              </span>
            }
            confirmText="Reject"
            cancelText="Cancel"
            variant="destructive"
            onConfirm={async (callback) => {
              const form = document.querySelector("form");
              if (form) {
                await submitForm(new FormData(form), "reject");
              }
              callback();
            }}
          >
            <Button className="py-4 w-full" variant="destructive">
              Reject Requisition
            </Button>
          </ActionConfirmation>
          <ActionConfirmation
            title="Approve Requisition"
            description={
              <span className="inline-block pb-4">
                Are you sure you want to approve this requisition?
              </span>
            }
            confirmText="Approve"
            cancelText="Cancel"
            onConfirm={async (callback) => {
              const form = document.querySelector("form");
              if (form) {
                await submitForm(new FormData(form), "approve");
              }
              callback();
            }}
          >
            <Button type="button" variant="default" className="w-full">
              Approve Requisition
            </Button>
          </ActionConfirmation>
        </div>
      </form>
    </>
  );
}

//  FIXME : need to be refactored
function DepartmentProcurementPlans({ officer }: any) {
  const [plans, setPlans] = useState<DepartmentProcurementPlan["items"]>();
  const [partOfAnnualPlan, togglePartOfAnnualPlan] = useState(false);
  const [annualPlan, setAnnualPlan] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchDate = async () => {
      const department_id = officer.department.id;
      if (CACHE.has("plans_" + department_id)) {
        setPlans(CACHE.get("plans_" + department_id));
        return;
      }
      const response = await getDepartmentProcurementPlanItems(department_id);
      if (response.success) {
        setPlans(response.data);
        CACHE.set("plans_" + department_id, response.data);
      } else {
        toast.error("unable to get the plans for this requisition");
      }
    };
    fetchDate();
  }, [officer]);

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="part_of_annual_plan">Part of Annual Plan</Label>
        {/* TODO: Make sure this switch is does not toggle when the annual plan is not selected*/}
        <Switch
          id="part_of_annual_plan"
          name="part_of_annual_plan"
          value={"YES"}
          onCheckedChange={togglePartOfAnnualPlan}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="part_of_annual_plan">Annual Procurement Plan</Label>
        <Select
          name="annual_procurement_plan_id"
          disabled={!partOfAnnualPlan}
          required={partOfAnnualPlan}
          value={annualPlan}
          onValueChange={setAnnualPlan}
        >
          <SelectTrigger
            title={
              partOfAnnualPlan
                ? ""
                : "It must be part of an annual plan before selecting a plan"
            }
            className="h-[35px] disabled:cursor-default"
          >
            <SelectValue
              placeholder={partOfAnnualPlan ? "Specify the plan" : ""}
            />
          </SelectTrigger>
          <SelectContent className="p-0">
            <SelectGroup>
              <SelectLabel>
                {plans && plans.length < 1
                  ? "No annual plans for this Department"
                  : "Annual Procurement Plan"}
              </SelectLabel>

              {plans?.map((plan: any) => {
                return (
                  <SelectItem
                    key={plan.id}
                    value={String(plan.id)}
                    className="capitalize"
                  >
                    {plan.description}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

const locale = new Intl.Locale("en", { region: "GM" });
