import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const gitignore = readFileSync(".gitignore", "utf8");
const dockerignore = readFileSync(".dockerignore", "utf8");

describe("public repository boundary", () => {
  it("keeps secrets and local planning files out of the public repository", () => {
    expect(gitignore).toContain(".env");
    expect(gitignore).toContain(".env.*");
    expect(gitignore).toContain("AGENTS.md");
    expect(gitignore).toContain("CONTEXT.md");
    expect(gitignore).toContain("docs/");
    expect(gitignore).toContain(".agents/");
    expect(gitignore).toContain(".codex/");
    expect(gitignore).toContain(".scratch/");
  });

  it("keeps unreviewed generated output out of the public repository", () => {
    expect(gitignore).toContain("dist/");
    expect(gitignore).toContain("coverage/");
    expect(gitignore).toContain("public/generated/");
    expect(gitignore).toContain("src/generated/");
    expect(gitignore).toContain("ai-output/");
    expect(gitignore).toContain("agent-output/");
  });

  it("keeps private planning files out of Docker build context", () => {
    expect(dockerignore).toContain(".env");
    expect(dockerignore).toContain("AGENTS.md");
    expect(dockerignore).toContain("CONTEXT.md");
    expect(dockerignore).toContain("docs");
    expect(dockerignore).toContain(".agents");
    expect(dockerignore).toContain(".codex");
    expect(dockerignore).toContain(".scratch");
  });
});
