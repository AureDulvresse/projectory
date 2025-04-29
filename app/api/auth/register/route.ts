import { NextRequest, NextResponse } from "next/server";
import { register } from "@/lib/actions/auth";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const result = await register(data);

    if (!result.success) {
      return NextResponse.json(
        { error: result?.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);

  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement" },
      { status: 500 }
    );
  }
}
