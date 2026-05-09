import { Resend } from "resend";

export const FROM_EMAIL = "Kadima Academy <noreply@kadima.academy>";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }
  return _resend;
}
