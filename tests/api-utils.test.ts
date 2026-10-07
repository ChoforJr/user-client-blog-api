import assert from "node:assert/strict";
import test from "node:test";
import {
  deduplicateById,
  getApiError,
  resolveApiBaseUrl,
  upsertById,
} from "../lib/api-utils.js";

test("uses the primary API URL and normalizes trailing slashes", () => {
  assert.equal(
    resolveApiBaseUrl(
      " https://public.example.com/// ",
      "https://server.example.com",
    ),
    "https://public.example.com",
  );
});

test("uses the server API URL when no public URL is configured", () => {
  assert.equal(
    resolveApiBaseUrl("", "https://server.example.com/"),
    "https://server.example.com",
  );
});

test("returns API validation errors as a readable message", () => {
  assert.equal(
    getApiError(
      { errors: [{ message: "Invalid email." }, "Password is required."] },
      "Request failed",
    ),
    "Invalid email. Password is required.",
  );
});

test("uses a fallback for an unknown API error shape", () => {
  assert.equal(getApiError(null, "Request failed"), "Request failed");
});

test("upserts a comment by ID when the API response races the WebSocket event", () => {
  const first = { id: "46", content: "First copy" };
  const newer = { id: "46", content: "Canonical comment" };

  assert.deepEqual(upsertById([first], newer), [newer]);
  assert.deepEqual(upsertById(upsertById([], newer), newer), [newer]);
});

test("deduplicates existing comments that share an ID", () => {
  assert.deepEqual(
    deduplicateById([
      { id: "46", content: "Old copy" },
      { id: "47", content: "Other comment" },
      { id: "46", content: "Latest copy" },
    ]),
    [
      { id: "46", content: "Latest copy" },
      { id: "47", content: "Other comment" },
    ],
  );
});
