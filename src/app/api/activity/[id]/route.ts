import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();
    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/activity/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying activity update request:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}
