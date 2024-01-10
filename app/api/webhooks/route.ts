import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function POST(request: NextRequest) {
  const response = NextResponse.json(
    {
      body: request.body,
      path: request.nextUrl.pathname,
      query: request.nextUrl.search,
      cookies: request.cookies.getAll(),
    },
    {
      status: 200,
    }
  );
  console.log({ response });
  return response;
}
