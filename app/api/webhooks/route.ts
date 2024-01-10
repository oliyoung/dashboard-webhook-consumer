import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request: NextRequest) {
  const eventBody = await request.json();
  const messageBody = JSON.parse(eventBody.Message);
  const url = `https://api.sandbox.immutable.com/v1/chains/imtbl-zkevm-testnet/collections/${messageBody.data.contract_address}/nfts/${messageBody.data.token_id}/owners?page_size=1`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    const walletAddress = data.result[0].account_address;
    await kv.sadd(walletAddress, JSON.stringify(messageBody.data));
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
  return NextResponse.json({ status: 201 });
}
