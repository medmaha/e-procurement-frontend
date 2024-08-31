"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import SubmitButton from "@/Components/widget/SubmitButton";
import { getVerificationCode, sendVerificationCode } from "../action";
import ActionButton from "@/Components/ActionButton";
import { format, formatDistanceToNow } from "date-fns";

type Props = {
	data: ContactPerson;
};

export default function VerifyContactDetails(props: Props) {
	const [isOpen, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [timer, setTimer] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	async function update(formData: FormData) {
		const response = await sendVerificationCode(formData, location.pathname);

		if (response.success) {
			toast.success(response.message);
			formRef.current?.reset();
			return setOpen(false);
		}
		toast.error(response.message);
	}
	async function _getVerificationCode() {
		if (loading) return;
		if (timer) return;
		setLoading(true);
		const response = await getVerificationCode();
		setLoading(false);
		if (response.success) {
			toast.success(
				response.message || "Verification code sent to your email",
				{ position: "top-center" }
			);
			localStorage.setItem("lastResend", new Date().toISOString());
			localStorage.setItem(
				"nextResend",
				new Date(new Date().getTime() + 2 * 60 * 1000).toISOString()
			);
			setTimer(true);
			return;
		}
		toast.error(response.message || "Failed to send verification code", {
			position: "top-center",
		});
	}

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className="font-semibold h-max px-4 py-2 hover:outline outline-muted-foreground outline-1"
				>
					Verify My Contact Details
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[500px] w-full max-h-[98dvh] overflow-hidden overflow-y-auto border">
				<DialogHeader>
					<DialogTitle>Verify Your Email Address</DialogTitle>
					<DialogDescription>
						A verification code was sent to{" "}
						<b className="link">{` ${props.data.email}`}</b>
						{", "} please check your email and verify your account
					</DialogDescription>
				</DialogHeader>
				<form action={update} className="grid gap-4 w-full pt-4">
					<div className="grid gap-2 pb-4">
						<Label htmlFor="code" className="font-semibold text-base">
							Verification Code
						</Label>
						<Input
							disabled={loading}
							id="code"
							name="code"
							required
							minLength={6}
							maxLength={6}
							type="number"
							className="appearance-none"
						/>
					</div>
					<ActionButton
						text="Verify"
						btnProps={{ type: "submit", disabled: loading }}
					/>
				</form>
				<form className="border-t mt-4 pt-4" action={_getVerificationCode}>
					<Timer
						loading={loading}
						timer={timer}
						setTimer={setTimer}
						email={props.data.email}
					/>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function Timer({ email, timer, setTimer }: any) {
	const [time, setTime] = useState<string | null | undefined>();
	const timeout = useRef<NodeJS.Timeout>();

	const getResendTime = useCallback(function (): Date[] {
		let lastResend: any = localStorage.getItem("lastResend");
		let nextResend: any = localStorage.getItem("nextResend");
		lastResend = lastResend ? new Date(lastResend) : null;
		nextResend = nextResend ? new Date(nextResend) : null;

		return [lastResend, nextResend];
	}, []);

	const closeTimer = useCallback(
		function () {
			localStorage.removeItem("lastResend");
			localStorage.removeItem("nextResend");
			clearInterval(timeout.current);
			clearInterval(timeout.current);
			setTimer(false);
		},
		[setTimer]
	);

	const getNextResend = useCallback(
		function () {
			// Calculate the next allowed resend time based on the last resent time

			const [lastResent, nextResend] = getResendTime();
			if (!lastResent || !nextResend) {
				closeTimer();
				return null;
			}
			const now = new Date();

			// Check if the current time is after the next allowed resend time
			if (now < nextResend) {
				// User must wait for 2 minutes to resend the code
				return `${Math.floor((nextResend.getTime() - now.getTime()) / 1000)}s`;
			} else {
				closeTimer();
				return null;
			}
		},
		[getResendTime, closeTimer]
	);

	useEffect(() => {
		if (timer) {
			timeout.current = setInterval(() => {
				setTime(getNextResend());
			}, 1000);
		} else {
			setTime(null);
			clearInterval(timeout.current);
		}
	}, [timer, getNextResend]);

	return (
		<>
			{time === null && (
				<div className="flex flex-wrap flex-col gap-2 justify-center items-center">
					<p className="text-muted-foreground">
						Don&apos;t receive the code yet?
					</p>
					<ActionButton
						text="Resent Code"
						btnProps={{
							size: "sm",
							className: "font-semibold text-sm",
							disabled: !!time,
						}}
					/>
				</div>
			)}
			{time && (
				<>
					<p className="text-xs w-max mx-auto pt-2 text-center text-muted-foreground max-w-[50ch]">
						We&apos;ve sent a verification code to your email,
						<br />
						this might upto 3 minutes
					</p>
					<p className="text-xs w-max mx-auto pt-2 text-destructive">
						Please wait for {time} to resend code
					</p>
				</>
			)}
		</>
	);
}
