import axios from "axios";

const NETWORK = process.env.NETWORK || "cardano-mainnet";
const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID || "";
const BF_BASE =
  NETWORK === "cardano-mainnet"
    ? "https://cardano-mainnet.blockfrost.io/api/v0"
    : "https://cardano-preprod.blockfrost.io/api/v0";

export async function submitTxBlockfrost(
  rawCbor: Buffer
): Promise<{ ok: boolean; txHash?: string; error?: string }> {
  try {
    const res = await axios.post(`${BF_BASE}/tx/submit`, rawCbor, {
      headers: {
        project_id: BLOCKFROST_PROJECT_ID,
        "Content-Type": "application/cbor",
      },
      timeout: 30000,
    });
    return { ok: true, txHash: res.data, error: undefined };
  } catch (err: any) {
    return {
      ok: false,
      error: err.response?.data?.message || "invalid_transaction_state",
    };
  }
}

export async function checkTxOutput(
  txHash: string,
  payTo: string,
  unit: string,
  minAmount: number,
  waitSeconds = 20
): Promise<boolean> {
  const deadline = Date.now() + waitSeconds * 1000;
  while (Date.now() < deadline) {
    try {
      const res = await axios.get(`${BF_BASE}/txs/${txHash}/utxos`, {
        headers: { project_id: BLOCKFROST_PROJECT_ID },
        timeout: 15000,
      });
      for (const out of res.data.outputs || []) {
        if (out.address !== payTo) continue;
        for (const amt of out.amount || []) {
          if (amt.unit === unit && Number(amt.quantity) >= minAmount) {
            return true;
          }
        }
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}
