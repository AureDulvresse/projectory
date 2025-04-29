import { auth } from "@/auth";
import { createWorkspace, getUserWorkspaces } from "@/lib/actions/workspace";
import console from "console";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getUserWorkspaces();

    if (!result.success) {
      return { error: "erreur" };
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[WORKSPACES_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const result = await createWorkspace(data);

    if (!result.success) {
      return { error: "erreur" };
    }
    
    return NextResponse.json(result.data);
    
  } catch (error) {
    console.error("[WORKSPACE_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
