import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Silent Oracle",
  description: "How Silent Oracle collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <article className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed">
        <h1 className="text-2xl font-bold text-orange-500">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: June 2026</p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">1. Who We Are</h2>
          <p>
            Silent Oracle (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a numerology and astrology
            application operated by Silent Oracle. By creating an account or using our services, you agree
            to the data practices described in this policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">2. What We Collect</h2>
          <p>We collect the following information when you create an account:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Full name</strong> — used to personalize your numerology readings</li>
            <li><strong>Email address</strong> — used as your account identifier and for subscription management</li>
            <li><strong>Birth date</strong> — used to calculate your Life Path, Personal Year, Chinese zodiac, and other numerology data</li>
            <li><strong>4-digit PIN</strong> — used for passwordless authentication (stored as a hashed value, never in plain text)</li>
            <li><strong>Oracle AI questions</strong> — the questions you ask the Oracle AI are stored to track your usage credits</li>
            <li><strong>Subscription status</strong> — whether you have an active Oracle Pro subscription via Whop</li>
          </ul>
          <p>We do <strong>not</strong> collect: your physical location, browsing history, device identifiers beyond what is necessary for session management, or any data from third-party social media accounts.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">3. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To calculate and display your personal numerology profile (Life Path, Personal Year, Chinese zodiac, etc.)</li>
            <li>To authenticate your account and maintain your session</li>
            <li>To track your Oracle AI query credits (3 free lifetime credits for free users, unlimited for Pro)</li>
            <li>To verify your subscription status with Whop</li>
            <li>To personalize Oracle AI responses using your numerology profile (your name and email are never sent to the AI — only your calculated numbers and zodiac signs)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">4. Oracle AI &amp; Data Sharing</h2>
          <p>
            When you ask the Silent Oracle AI a question, we send your question and your pre-calculated
            numerology profile (Life Path number, Personal Year, Chinese zodiac sign, etc.) to our AI
            provider to generate a response. <strong>We do not send your name, email, or PIN to the AI
            provider.</strong> The AI provider&apos;s privacy policy applies to the processing of these queries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Whop Payment Processing</h2>
          <p>
            Subscription payments are processed by Whop (whop.com). We do not store your credit card
            information, billing address, or any payment details. Whop handles all payment data in
            accordance with their own privacy policy and PCI-DSS compliance standards. We only receive
            your email address (to link the payment to your account) and your subscription status
            (active/canceled).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">6. Data Storage &amp; Security</h2>
          <p>
            Your account data is stored in a secure database. Your PIN is hashed using HMAC-SHA256
            with a server-side secret — it is never stored in plain text and cannot be reverse-engineered.
            Session tokens are signed JWTs stored in HTTP-only cookies. We use industry-standard
            security practices to protect your data.
          </p>
          <p>
            Despite our efforts, no method of transmission or storage is 100% secure. We cannot guarantee
            absolute security but we are committed to protecting your information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">7. Data Retention</h2>
          <p>
            Your data is retained for as long as your account is active. If you wish to delete your
            account and all associated data, contact us at the email below. Account deletion is
            permanent and cannot be undone — all your numerology profiles, Oracle query history, and
            subscription status will be permanently removed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">8. Your Rights (GDPR / POPIA / CCPA)</h2>
          <p>Depending on your jurisdiction, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access</strong> — request a copy of your personal data</li>
            <li><strong>Correct</strong> — fix inaccurate data (e.g., wrong birth date)</li>
            <li><strong>Delete</strong> — request permanent deletion of your account and data</li>
            <li><strong>Withdraw consent</strong> — stop processing at any time</li>
            <li><strong>Data portability</strong> — receive your data in a machine-readable format</li>
          </ul>
          <p>To exercise any of these rights, contact us at the email below.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">9. Children</h2>
          <p>
            Silent Oracle is not intended for users under 16 years of age. We do not knowingly collect
            data from children. If you believe a child has provided us with personal data, please contact
            us and we will delete it immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">10. Cookies</h2>
          <p>
            We use essential cookies only — no tracking, advertising, or analytics cookies. Our cookies
            include:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>so_session</strong> — your authenticated session token (HTTP-only, 30-day expiry)</li>
            <li><strong>so_oauth_state</strong> — temporary CSRF protection during Whop OAuth (10-minute expiry)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">11. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Continued use of Silent Oracle after changes
            constitutes acceptance of the updated policy. We will notify users of significant changes
            via email (if we have your email on file).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">12. Contact</h2>
          <p>
            For privacy questions, data requests, or account deletion, contact:{" "}
            <span className="text-orange-500 font-medium">support@silentoracle.app</span>
          </p>
        </section>

        <hr className="border-border" />
        <p className="text-xs text-muted-foreground">
          Silent Oracle is a numerology and astrology tool for reflection and entertainment. All
          calculations run server-side. Your data is never sold or shared with third parties for
          marketing purposes.
        </p>
      </article>
    </main>
  );
}
