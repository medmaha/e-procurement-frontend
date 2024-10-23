"use client";
import { doLogin } from "./actions";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import { Input } from "@/Components/ui/input";
import SubmitButton from "@/Components/widget/SubmitButton";

type Props = {
  email?: string;
  password?: string;
};

export default function Form({ email, password }: Props) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (formData) => {
        const data = await doLogin(formData);
        if (data.error) {
          toast.error(data.message, {
            position: "bottom-center",
            autoClose: 7000,
          });
          const passwordField = ref.current?.querySelector(
            '[type="password"]'
          ) as HTMLInputElement;
          if (passwordField) {
            passwordField.value = "";
          }
        } else {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 2500,
            closeOnClick: false,
            hideProgressBar: true,
          });
          await new Promise((resolve) => setTimeout(resolve, 2500));
          ref.current?.reset();
          const url = new URL(location.href);
          const next = url.searchParams.get("next");
          if (next && next !== location.pathname) {
            location.href = next;
          } else {
            location.href = "/organization/staffs";
          }
        }
      }}
      className="block w-full"
    >
      <div className="pb-4 group">
        <label
          htmlFor="email"
          className="inline-flex items-center gap-1 text-lg pb-1"
        >
          <span>Email Address</span>

          <span title="Field is required" className="font-bold text-primary">
            *
          </span>
        </label>

        <Input
          required
          type="email"
          id="email"
          name="email"
          defaultValue={email}
          placeholder="abc@example2.com"
          className="py-1.5 w-full "
        />

        <p className="text-sm hidden text-destructive px-1 error-msg">
          Email Address field is required
        </p>
      </div>
      <div className="pb-4 pt-2 group">
        <label
          htmlFor="password"
          className="inline-flex items-center gap-1 text-lg pb-1"
        >
          <span>Password</span>

          <span title="Field is required" className="font-bold text-primary">
            *
          </span>
        </label>

        <Input
          required
          type="password"
          id="password"
          name="password"
          defaultValue={password}
          placeholder="-----------"
          className="py-1.5  w-full"
        />

        <p className="text-sm hidden text-destructive px-1 error-msg">
          Password field is required
        </p>
      </div>
      <div className="flex items-center px-4 pt-4">
        <SubmitButton text={"Submit"} className="w-full md:font-semibold" />
      </div>
    </form>
  );
}
