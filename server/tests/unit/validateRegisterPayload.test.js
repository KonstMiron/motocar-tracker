import { validateRegisterPayload } from "../../src/utils/validateRegisterPayload.js";

test("validateRegisterPayload: missing fields -> ok=false", () => {
  const r = validateRegisterPayload({ email: "a@b.com", password: "123456" });
  expect(r.ok).toBe(false);
  expect(r.message).toBe("missing_fields");
});

test("validateRegisterPayload: valid payload -> ok=true", () => {
  const r = validateRegisterPayload({ username: "miron", email: "miron@example.com", password: "123456" });
  expect(r.ok).toBe(true);
});