import { clearAuthenticationCookies } from "@/lib/auth/actions";
import { getAuthenticatedUser } from "@/lib/auth/generics";
import { fileUploader } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

type FileData = {
  file: File;
  path?: string;
  metadata?: Json;
};

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user) {
    await clearAuthenticationCookies();
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  let data;
  try {
    const formData = await request.formData();
    data = Object.fromEntries(formData.entries());

    data.metadata = JSON.parse((data.metadata as string) || "{}");
  } catch (error) {
    try {
      data = await request.json();
      data.metadata = JSON.parse((data.metadata as string) || "{}");
    } catch (error) {
      return Response.json(
        { message: "Invalid Request Body" },
        { status: 400 }
      );
    }
  }

  try {
    const url = ""
    // const url = await fileUploader(
    //   data.file,
    //   data.path || "e-procurement/contracts/drafts",
    //   data.metadata
    // );
    return Response.json({ url }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Failed to Upload File" }, { status: 500 });
  }
}
