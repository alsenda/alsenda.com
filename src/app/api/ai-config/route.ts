import { NextResponse } from "next/server";

export async function GET() {
  const useMockAI = process.env.USE_MOCK_AI === 'true';
  return NextResponse.json({ useMockAI });
}
