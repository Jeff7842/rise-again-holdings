import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const upstream = await fetch(`${process.env.GO_API_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}