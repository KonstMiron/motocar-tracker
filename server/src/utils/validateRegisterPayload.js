export const validateRegisterPayload = ({ username, email, password } = {}) => {
  if (!username || !email || !password) return { ok: false, message: "missing_fields" };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return { ok: false, message: "invalid_email" };
  if (password.length < 6) return { ok: false, message: "weak_password" };
  return { ok: true };
};