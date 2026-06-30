import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendVerificationCode(email: string, code: string): Promise<void> {
  await resend.emails.send({
    from: process.env.RESEND_FROM || "Silent Oracle <onboarding@resend.dev>",
    to: email,
    subject: "Your Silent Oracle verification code",
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0d0d0d;color:#e5e5e5;border-radius:12px;border:1px solid #333">
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:28px;margin-bottom:4px">🔮</div>
        <div style="font-size:14px;letter-spacing:3px;color:#f97316;font-weight:900">SILENT ORACLE</div>
      </div>
      <p style="font-size:14px;line-height:1.6">Your verification code is:</p>
      <div style="text-align:center;margin:24px 0;padding:16px;background:#1a1a1a;border-radius:8px;border:1px solid #333">
        <span style="font-size:36px;font-weight:900;letter-spacing:8px;color:#f97316;font-family:monospace">${code}</span>
      </div>
      <p style="font-size:12px;color:#888;line-height:1.6;text-align:center">This code expires in 15 minutes. If you didn't request this, ignore this email.</p>
      <p style="font-size:11px;color:#666;text-align:center;margin-top:20px">Silent Oracle — Numerology &amp; Astrology. For reflection and entertainment purposes only.</p>
    </div>`,
  });
}
