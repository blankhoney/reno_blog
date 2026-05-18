export type HealthPayload = {
  name: "reno-blog";
  ok: true;
};

export function getHealthPayload(): HealthPayload {
  return {
    name: "reno-blog",
    ok: true,
  };
}
