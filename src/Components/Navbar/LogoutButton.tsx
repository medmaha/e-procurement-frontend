"use client";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { logoutAuthUser } from "@/lib/auth/actions";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const logout = async (formData: FormData) => {
    try {
      const { message } = await logoutAuthUser(pathname);
      toast.info(message, {
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({
        type: "all",
      });
    } catch (error) {}
  };

  return (
    <form className="inline-block w-full h-full" action={logout}>
      <button className="inline-flex text-sm items-center gap-2 h-[35px] px-2 hover:bg-secondary text-foreground hover:text-secondary-foreground rounded-md w-full justify-between">
        Logout
        <LogOut width={16} />
      </button>
    </form>
  );
}
