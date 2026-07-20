import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const {
      status,
      notes_internal,
      follow_up_at,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("activation_requests")
      .update({
        status,
        notes_internal,
        follow_up_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        error: "Er is iets misgegaan.",
      },
      {
        status: 500,
      }
    );
  }
}