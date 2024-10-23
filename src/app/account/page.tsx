import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/lib/auth/constants";
import { cookies } from "next/headers";
import React from "react";
import { convertUrlSearchParamsToSearchString } from "@/lib/helpers";
import { Button } from "@/Components/ui/button";
import { Loader2 } from "lucide-react";

export default function page(props: PageProps) {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = cookies().get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const queryString = convertUrlSearchParamsToSearchString(props.searchParams);

  // const returnToDashboard = () => {
  // 	const nextPage = props.searchParams.next;
  // 	const user = validateAndDecodeJWT(accessToken)?.user!;
  // 	let dashboard =
  // 		nextPage ||
  // 		(user?.profile_type === "Vendor" ? "/dashboard/vendor" : "/dashboard");
  // 	return redirect(dashboard);
  // };

  // if (accessToken) {
  // 	return returnToDashboard();
  // }
  // if (!refreshToken) {
  // 	return redirect("/account/login" + queryString);
  // }

  return (
    <section className="section">
      <div className="pt-[50px] sm:pt-[100px] w-full flex items-start justify-center">
        <div className="w-max p-4 flex flex-col gap-2 items-center">
          <div className="w-max">
            <Loader2
              className={`w-16 h-16 duration-1000 delay-200 animate-spin`}
            />
          </div>
          <p className={`text-muted-foreground text-lg pt-2 animate-bounce`}>
            Authenticating Your Session
          </p>
          <div className="flex flex-col justify-center gap-4 items-center pt-8">
            <p className="text-xs text-destructive">
              This request is taking longer than expected.
            </p>
            <Button
              onClick={async ({ currentTarget }) => {
                // abortcontroller.current.abort();
                currentTarget.disabled = true;
                // await retryPage(location.pathname);
                currentTarget.disabled = false;
                // setIsTimeout(false);
              }}
            >
              Cancel and Retry
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
