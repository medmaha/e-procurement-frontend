"use client";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/Components/ui/textarea";
import DepartmentSelection from "@/Components/widget/DepartmentsSelect";
import StaffsSelect from "@/Components/widget/StaffsSelect";
import SubmitButton from "@/Components/widget/SubmitButton";
import { createUnit, retrieveUpdateUnit, updateUnit } from "../actions";
import { Unit } from "../types";

const CACHE = new Map();

export default function AddUnit(props: any) {
  const { text, unit: data, children, autoOpen = false } = props;
  const [isOpen, setIsOpen] = React.useState(autoOpen);
  const [unit, setUnit] = useState(data as Unit | null);
  const unitRef = useRef(unit);

  // useEffect(() => {
  // 	const fetchData = async () => {
  // 		if (unitRef.current && isOpen) {
  // 			const unit_id = "unit_" + unitRef.current.id;
  // 			if (CACHE.has(unit_id)) {
  // 				return setUnit(CACHE.get(unit_id));
  // 			}
  // 			const response = await retrieveUpdateUnit(String(unitRef.current.id));
  // 			if (response.success) {
  // 				CACHE.set(unit_id, response.data);
  // 				setUnit(response.data);
  // 			}
  // 		}
  // 	};
  // 	fetchData();
  // }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <Button className="" size={"sm"}>
              {text ? text : "Add a Unit"}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[700px]">
          <DialogHeader className="px-2 sm:px-4 border-b pb-4">
            <DialogTitle className="">
              {unit ? "Edit Unit" : "New Unit"}
            </DialogTitle>
            <DialogDescription>
              {unit
                ? "Update the existing unit details."
                : "Provide the details for the new unit."}
            </DialogDescription>
          </DialogHeader>
          {isOpen && <Form unit={unit} closeDialog={() => setIsOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Form({ closeDialog, unit }: any) {
  async function submit(formData: FormData) {
    const { message, success } = await (unit ? updateUnit : createUnit)(
      formData,
      location.pathname
    );
    if (success) {
      CACHE.delete("unit_" + unit.id);
      toast.success(message);
      closeDialog();
      return;
    }
    toast.error(message);
  }

  function getDefaultValue(fieldName: string) {
    if (!unit) return "";
    if (fieldName === "unit_head") {
      return unit.unit_head?.id;
    }
    if (fieldName === "department") {
      return unit.department?.id;
    }
    return unit[fieldName];
  }

  return (
    <>
      <form action={submit} className="grid gap-1 pt-4">
        {unit && <input name="obj_id" defaultValue={unit.id} hidden />}
        {fields.map((field) => {
          return (
            <Field
              key={field.name}
              field={field}
              value={getDefaultValue(field.name)}
            />
          );
        })}
        <div className="px-4 pt-6">
          <SubmitButton text={unit ? "Update Unit" : "Save Unit"} />
        </div>
      </form>
    </>
  );
}

function Field({ field, value }: any) {
  return (
    <div className="pb-4">
      <Label className="pb-1 gap-1 inline-flex items-start">
        {field.label}
        <span className="text-primary" title=" This field is required">
          {field.required && "*"}
        </span>
        <small className="pl-4 opacity-80 font-light">
          {field.help && <>{"( " + field.help + ")"}</>}
        </small>
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          name={field.name}
          defaultValue={value}
          required={field.required}
        ></Textarea>
      ) : typeof field.selector === "function" ? (
        <field.selector
          defaultValue={value}
          open={open}
          name={field.name}
          required={field.required}
        />
      ) : (
        <Input
          defaultValue={value}
          type={field.type}
          name={field.name}
          required={field.required}
          {...field.attr}
        />
      )}
    </div>
  );
}

// form fields for creating a new unit of an organization in an e-procurement site
const fields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    help: "The name of the unit",
    required: true,
    attr: { minLength: 3, maxLength: 50 },
  },
  {
    name: "department",
    label: "Department",
    help: "The department this unit belongs to",
    type: "select",
    selector: DepartmentSelection,
    required: true,
  },
  // {
  //   name: "unit_head",
  //   label: "Unit Head",
  //   help: "The staff that manages the unit",
  //   type: "select",
  //   selector: StaffsSelect,
  // },
  {
    name: "phone",
    label: "Phone",
    help: "The telephone number of the unit",
    type: "tel",
  },
  {
    name: "description",
    label: "Description",
    help: "The description of the unit",
    type: "textarea",
  },
];
