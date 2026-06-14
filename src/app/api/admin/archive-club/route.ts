import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { clubId } = await req.json();

    if (!clubId) {
      return NextResponse.json(
        { error: "clubId ontbreekt" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("clubs")
      .update({
        status: "archived",
        archived_at: new Date().toISOString(),
      })
      .eq("id", clubId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err?.message ??
          "Archiveren mislukt",
      },
      { status: 500 }
    );
  }
}