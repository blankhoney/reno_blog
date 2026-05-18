import { getHealthPayload } from "../lib/health";

export function GET() {
  return new Response(JSON.stringify(getHealthPayload()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
