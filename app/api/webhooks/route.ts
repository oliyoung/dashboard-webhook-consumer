import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { kv } from "@vercel/kv";

/*
{
  "event_name": "imtbl_zkevm_nft_updated",
  "event_id": "018cf1b5-95dc-5594-4198-75ef2df27d03",
  "chain": "imtbl-zkevm-testnet",
  "data": {
    "chain": { "id": "eip155:13473", "name": "imtbl-zkevm-testnet" },
    "contract_address": "0x03a6a9e9f9fba7a2823ba7085f93431a0245d5d2",
    "indexed_at": "2024-01-10T04:50:58.154344Z",
    "metadata_synced_at": "2024-01-10T04:50:58.647525Z",
    "token_id": "14",
    "metadata_id": "018cf196-26da-1028-707e-3bb23550992b"
  }
}
*/
export async function POST(request: NextRequest) {
  const eventBody = await request.json();
  const messageBody = JSON.parse(eventBody.Message);

  const url = `https://api.sandbox.immutable.com/v1/chains/imtbl-zkevm-testnet/collections/${messageBody.data.contract_address}/nfts/${messageBody.data.token_id}/owners?page_size=1`;
  const options = { method: "GET", headers: { Accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    const walletAddress = data.result[0].account_address;
    await kv.sadd(walletAddress, JSON.stringify(messageBody.data));
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({ status: 201 });
}
