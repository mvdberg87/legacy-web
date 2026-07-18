import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Nieuwe Talentpool-aanmelding:", body);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Er ging iets mis.",
      },
      {
        status: 500,
      }
    );
  }
}