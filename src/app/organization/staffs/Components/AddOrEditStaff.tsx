"use client";
import React, {
  ReactNode,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import GroupsSelect from "@/Components/widget/AuthGroupsSelect";
import SubmitButton from "@/Components/widget/SubmitButton";
import UnitsSelect from "@/Components/widget/UnitsSelect";
import { createStaff, retrieveUpdateStaff, updateStaff } from "../actions";
import {  useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  staff?: undefined | Staff;
  user: AuthUser;
  children?: ReactNode;
  isAdmin?: boolean;
  autoOpen?: boolean;
  onClose?: any;
};

export default function AddOrEditStaff(props: Props) {
  const {  user, children, autoOpen } = props;
  const [isOpen, setIsOpen] = React.useState(autoOpen);

  const staffQuery = useQuery({
    staleTime: Infinity,
    enabled: isOpen && !!props.staff,
    queryKey: ["staff", props.staff?.id, props.user.profile_id],
    queryFn: async () => {
      if (props.staff) {
        const response = await retrieveUpdateStaff(String(props.staff.id));
        if (response.success) {
          const data: Staff = { ...(props.staff || {}), ...response.data };
          return data;
        }
        throw response;
      }
    },
  });

  const queryClient = useQueryClient();

  const submit = async (formData: FormData) => {
    const func = props.staff ? updateStaff : createStaff;

    const data = Object.fromEntries(formData.entries());

    const { message, success } = await func(data);
    if (success) {
      toast.success(message);

      // invalidate queries
      // FIXME: avoid refetching this query when closing modal
      await queryClient.invalidateQueries({
        queryKey: ["staff", props.staff?.id, props.user.profile_id],
        refetchType: "none",
      });

      // Staff list table invalidation
      queryClient.invalidateQueries({
        queryKey: ["staffs", props.user.profile_id],
      });

      setIsOpen(false);
    }
    toast.success(message, { type: "error" });
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(opened) => {
          setIsOpen(opened);
          !opened && props.onClose?.();
        }}
      >
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-[700px] mx-auto px-2">
          <DialogHeader className="px-2 sm:px-4 border-b pb-4">
            <DialogTitle className="">
              {props.staff ? "Update Staff" : "Add A Staff"}
            </DialogTitle>
            <DialogDescription>
              {props.staff
                ? "Update the existing staff details."
                : "Provide the details for the new staff"}
            </DialogDescription>
          </DialogHeader>
          {isOpen && (
            <Form
              open={isOpen}
              staff={staffQuery.data || props.staff}
              submitFn={submit}
              user={user}
              isAdmin={props.isAdmin}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

type Props2 = {
  staff?: Staff;
  isAdmin?: boolean;
  user: AuthUser;
  open: boolean;
  submitFn: (formData: FormData) => Promise<void>;
};

function Form({ staff, user, open, isAdmin, submitFn }: Props2) {
  async function submit(formData: FormData) {
    await submitFn(formData);
  }

  function getDefaultValue(fieldName: string) {
    if (!staff || !staff.id) return undefined;
    if (fieldName === "unit") {
      return staff[fieldName]?.id;
    }
    if (fieldName === "first_name") {
      const [first_name] = staff["name"]?.split(" ");
      return first_name;
    }
    if (fieldName === "middle_name") {
      const [_, middle_name, last_name] = staff["name"].split(" ");
      return last_name ? middle_name : "";
    }
    if (fieldName === "last_name") {
      const [_, middle_name, last_name] = staff["name"].split(" ");
      return last_name ? last_name : middle_name;
    }
    return staff[fieldName as keyof Staff];
  }

  const [isValidForm, toggleIsValidForm] = useState(false);

  return (
    <>
      <form
        action={submit}
        className="grid gap-1"
        onInput={({ currentTarget }) =>
          toggleIsValidForm(currentTarget.checkValidity())
        }
        onChange={({ currentTarget }) =>
          toggleIsValidForm(currentTarget.checkValidity())
        }
      >
        {staff && <input name="obj_id" defaultValue={staff?.id} hidden />}
        <div className="max-h-[65dvh] grid gap-1 overflow-hidden overflow-y-auto px-4 pb-2 min-h-[60dvh]">
          {getFields(staff, user).map((field) => {
            return (
              <Field
                key={field.name}
                field={field}
                open={open}
                value={staff && getDefaultValue(field.name)}
              />
            );
          })}
        </div>
        <div className="px-4 pt-6 border-t justify-center items-center flex">
          <SubmitButton
            className="w-full sm:font-semibold"
            disabled={!isValidForm}
            text={staff ? "Update Staff" : "Save Staff"}
          />
        </div>
      </form>
    </>
  );
}

function Field({ field, value }: any) {
  const { pending } = useFormStatus();
  return (
    <div className="pb-4">
      <Label className="pb-1 gap-1 inline-flex items-start">
        {field.label}
        <span className="text-primary" title=" This field is required">
          {field.required && "*"}
        </span>
        <small className="pl-2 text-muted-foreground">
          {field.help && <>{"(" + field.help + ")"}</>}
        </small>
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          disabled={pending}
          name={field.name}
          defaultValue={value}
          required={field.required}
        ></Textarea>
      ) : typeof field.selector === "function" ? (
        <field.selector
          defaultValue={value}
          isMulti={true}
          name={field.name}
          disabled={pending}
          required={field.required}
        />
      ) : (
        <Input
          defaultValue={value}
          disabled={pending}
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          className="placeholder:text-xs"
        />
      )}
    </div>
  );
}

const Gender = ({ name, disabled, required, defaultValue }: any) => {
  // const [value, setValue] = useState<string>();

  // useEffect(() => {
  // 	if (defaultValue) setValue(defaultValue?.trim().toLowerCase());
  // }, [defaultValue]);

  return (
    <Select
      key={defaultValue}
      disabled={disabled}
      required={required}
      name={name}
      // value={value}
      defaultValue={defaultValue}
      // onValueChange={setValue}
    >
      <SelectTrigger>
        <SelectValue></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

// form fields for creating a new staff of an organization in an e-procurement site
const fields = [
  {
    name: "first_name",
    label: "First Name",
    help: "e.g. John",
    type: "text",
    required: true,
  },
  {
    name: "last_name",
    label: "Last Name",
    help: "e.g. Doe",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    help: "This will be used for logins and notifications",
    type: "email",
    required: true,
  },
  {
    name: "groups",
    label: "Groups",
    help: "Specify the authorization groups of the staff",
    type: "select",
    selector: GroupsSelect,
  },
  {
    name: "unit",
    label: "Unit",
    help: "What unit does the staff currently belong to?",
    type: "select",
    selector: UnitsSelect,
    required: true,
  },
  {
    name: "job_title",
    label: "Position",
    help: "Current position of the staff",
    type: "text",
    placeholder: "e.g. HR, Manager, Developer",
  },
  {
    name: "gender",
    help: "Staff gender",
    label: "Gender",
    type: "select",
    selector: Gender,
  },
  {
    name: "phone",
    label: "Phone Number",
    help: "Staff contact phone number",
    type: "tel",
    required: true,
  },
  {
    name: "biography",
    label: "Biography",
    help: "The biography of the staff",
    type: "textarea",
  },
];

const normalStaffFields = () =>
  fields.filter((f) => !["unit", "groups"].includes(f.name));
const adminStaffEditFields = () =>
  fields.filter((f) => !["last_name", "first_name"].includes(f.name));
const adminSelfEditFields = () =>
  fields.filter((f) => !["groups", "last_name", "first_name"].includes(f.name));

const getFields = (staff?: any, user?: any) => {
  if (!staff) return fields;
  if (staff.is_self && staff.is_admin) return adminSelfEditFields();
  if (staff.is_self) return normalStaffFields();

  return adminStaffEditFields();
};
