import { describe, expect, it } from "vitest";

import { getHealthPayload } from "../src/lib/health";

describe("health check", () => {
  it("returns a minimal stable payload for deployment probes", () => {
    expect(getHealthPayload()).toEqual({
      name: "reno-blog",
      ok: true,
    });
  });
});
