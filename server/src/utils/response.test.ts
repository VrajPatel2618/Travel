import assert from "node:assert/strict";
import test from "node:test";

import { pageMeta } from "./response";

test("pageMeta reports totals and total pages", () => {
  assert.deepEqual(pageMeta(2, 12, 31), {
    page: 2,
    limit: 12,
    total: 31,
    totalPages: 3
  });
});

test("pageMeta handles empty collections", () => {
  assert.deepEqual(pageMeta(1, 20, 0), {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
});
