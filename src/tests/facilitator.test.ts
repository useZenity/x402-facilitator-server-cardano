import { describe, it, expect } from "vitest";
import { submitTxBlockfrost } from "../services/blockfrostService";

it("returns error for invalid CBOR", async () => {
  const result = await submitTxBlockfrost(Buffer.from("deadbeef", "hex"));
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/invalid/i);
});
