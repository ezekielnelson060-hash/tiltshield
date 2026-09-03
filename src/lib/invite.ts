/** Household invite codes — local + profile field when cloud available. */

const CODE_KEY = "tiltshield_household_code";

function randomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return s;
}

export function getOrCreateHouseholdCode(): string {
  if (typeof window === "undefined") return "";
  let code = localStorage.getItem(CODE_KEY);
  if (!code) {
    code = randomCode();
    localStorage.setItem(CODE_KEY, code);
  }
  return code;
}

export function setHouseholdCode(code: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CODE_KEY, code.toUpperCase().trim());
}
