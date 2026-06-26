import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Silent Oracle",
  description: "The terms and conditions for using Silent Oracle.",
};

export default function TermsPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "#080500",
        color: "#FFFFFF",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        padding: "40px 20px 80px",
      }}
    >
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#FF7A00",
            fontFamily: "Georgia, serif",
            letterSpacing: "1px",
            marginBottom: 8,
          }}
        >
          Terms of Service
        </h1>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 32 }}>
          Last updated: June 2026
        </p>

        <Section title="1. Acceptance of Terms">
          By creating an account, accessing, or using Silent Oracle (the &quot;Service&quot;), you
          agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to
          these Terms, do not use the Service.
        </Section>

        <Section title="2. Description of Service">
          Silent Oracle is a numerology and astrology application that provides:
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>→ Personalized numerology profiles (Life Path, Personal Year, Chinese zodiac)</li>
            <li style={{ marginBottom: 8 }}>→ Daily energy insights and forecasts</li>
            <li style={{ marginBottom: 8 }}>→ Compatibility analysis between two birth dates</li>
            <li style={{ marginBottom: 8 }}>→ An entity database of 1,000+ famous people and brands</li>
            <li style={{ marginBottom: 8 }}>→ AI-powered Oracle guidance (limited free queries, unlimited with Pro)</li>
            <li style={{ marginBottom: 8 }}>→ Multi-entity analysis (persons, companies, countries, sports events) — Pro only</li>
          </ul>
        </Section>

        <Section title="3. Free Tier and Oracle Pro Subscription">
          <p><strong style={{ color: "#FF7A00" }}>Free Tier:</strong> All users receive 3 lifetime Oracle AI queries (never reset). The Analyzer (person/company/country/sports searches) is a Pro-only feature. Credits cannot be transferred, shared, or extended.</p>
          <p><strong style={{ color: "#FF7A00" }}>Oracle Pro:</strong> For $8.00 USD per month, subscribers receive unlimited Oracle AI queries and unlimited Analyzer searches. The subscription renews automatically each month until cancelled.</p>
          <p><strong style={{ color: "#FF7A00" }}>Cancellation:</strong> You may cancel your subscription at any time through Whop. Cancellation takes effect at the end of your current billing period. No refunds are issued for partial billing periods.</p>
          <p><strong style={{ color: "#FF7A00" }}>Price Changes:</strong> We reserve the right to change subscription pricing with at least 30 days notice. Existing subscribers will be charged the new price at their next renewal date.</p>
        </Section>

        <Section title="4. User Accounts">
          <p>You are responsible for maintaining the confidentiality of your PIN and account credentials. You agree to:</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>→ Provide accurate and complete information when creating an account</li>
            <li style={{ marginBottom: 8 }}>→ Keep your PIN secure and not share it with others</li>
            <li style={{ marginBottom: 8 }}>→ Notify us immediately of any unauthorized access</li>
            <li style={{ marginBottom: 8 }}>→ Be responsible for all activities under your account</li>
            <li style={{ marginBottom: 8 }}>→ Not create multiple accounts to circumvent free-tier limits</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>
        </Section>

        <Section title="5. Acceptable Use">
          You agree <strong>not</strong> to:
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>→ Use the Service for any unlawful purpose</li>
            <li style={{ marginBottom: 8 }}>→ Attempt to bypass rate limits, paywalls, or subscription requirements</li>
            <li style={{ marginBottom: 8 }}>→ Create multiple accounts to obtain additional free credits</li>
            <li style={{ marginBottom: 8 }}>→ Reverse engineer, decompile, or disassemble the Service</li>
            <li style={{ marginBottom: 8 }}>→ Use bots, scrapers, or automated tools to access the Service</li>
            <li style={{ marginBottom: 8 }}>→ Submit content that is offensive, illegal, or infringes others&apos; rights</li>
            <li style={{ marginBottom: 8 }}>→ Resell or redistribute access to the Service without permission</li>
            <li style={{ marginBottom: 8 }}>→ Use the Service to harm, harass, or defraud others</li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p>The Service, including its design, numerology methodology, calculations, entity database, Oracle AI system prompts, and software, is owned by Silent Oracle and protected by copyright and other intellectual property laws.</p>
          <p>You retain ownership of the questions you submit to the Oracle AI. By submitting a question, you grant us a non-exclusive, royalty-free license to process your question for the purpose of generating a response and tracking usage.</p>
          <p>The numerology methodology used by Silent Oracle is based on established numerological traditions including Pythagorean name math, master number theory, and Chinese zodiac traditions. The specific implementation, interpretations, and system prompts are proprietary to Silent Oracle.</p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p><strong style={{ color: "#FF4444" }}>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.</strong></p>
          <p>Silent Oracle is a numerology and astrology application intended for <strong>entertainment and reflection purposes only</strong>. The readings, predictions, and AI-generated guidance are not:</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>→ Professional financial, legal, or investment advice</li>
            <li style={{ marginBottom: 8 }}>→ Medical or psychological diagnosis or treatment</li>
            <li style={{ marginBottom: 8 }}>→ Guarantees of future outcomes or events</li>
            <li style={{ marginBottom: 8 }}>→ Scientifically validated predictions</li>
          </ul>
          <p>You should not make important life, financial, medical, or relationship decisions solely based on the Service. Always consult qualified professionals for important decisions.</p>
          <p>We do not warrant that the Service will be uninterrupted, error-free, secure, or that calculations are always accurate.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>To the maximum extent permitted by law, Silent Oracle and its operators shall <strong>not be liable</strong> for:</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>→ Any indirect, incidental, special, or consequential damages</li>
            <li style={{ marginBottom: 8 }}>→ Loss of profits, data, or business opportunities</li>
            <li style={{ marginBottom: 8 }}>→ Decisions you make based on the Service&apos;s readings or predictions</li>
            <li style={{ marginBottom: 8 }}>→ Any actions taken by third-party service providers (Whop, AI providers)</li>
            <li style={{ marginBottom: 8 }}>→ Unauthorized access to your account or data</li>
            <li style={{ marginBottom: 8 }}>→ Service interruptions, bugs, or calculation errors</li>
          </ul>
          <p>Your total aggregate liability claim against Silent Oracle is limited to the amount you have paid us in the 12 months preceding the claim, or $10.00 USD, whichever is greater.</p>
        </Section>

        <Section title="9. Indemnification">
          You agree to indemnify and hold Silent Oracle harmless from any claims, damages, losses,
          or expenses (including legal fees) arising from your use of the Service, your violation
          of these Terms, or your infringement of any third-party rights.
        </Section>

        <Section title="10. Account Termination">
          <p>You may delete your account at any time by contacting us. Upon deletion, all your personal data will be permanently removed.</p>
          <p>We reserve the right to suspend or terminate your account if you:</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}>→ Violate these Terms</li>
            <li style={{ marginBottom: 8 }}>→ Create multiple accounts to circumvent limits</li>
            <li style={{ marginBottom: 8 }}>→ Engage in fraudulent or abusive behavior</li>
            <li style={{ marginBottom: 8 }}>→ Fail to pay subscription fees</li>
          </ul>
          <p>Upon termination, your right to use the Service ends immediately. No refunds are provided for terminated accounts.</p>
        </Section>

        <Section title="11. Third-Party Services">
          <p>The Service integrates with third-party providers:</p>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            <li style={{ marginBottom: 8 }}><strong>Whop</strong> — handles subscription payments and checkout. Whop&apos;s Terms of Service apply to payment transactions.</li>
            <li style={{ marginBottom: 8 }}><strong>AI Provider</strong> — generates Oracle AI responses. Your questions are processed according to the AI provider&apos;s privacy policy.</li>
          </ul>
          <p>We are not responsible for the practices or policies of these third parties.</p>
        </Section>

        <Section title="12. Changes to Terms">
          We may update these Terms from time to time. We will notify users of significant changes
          by posting the updated Terms on this page with a new &quot;Last updated&quot; date.
          Continued use of the Service after changes constitutes acceptance of the updated Terms.
        </Section>

        <Section title="13. Governing Law">
          These Terms shall be governed by and construed in accordance with applicable laws,
          without regard to conflict of law principles. Any disputes shall be resolved in the
          applicable courts.
        </Section>

        <Section title="14. Severability">
          If any provision of these Terms is found to be unenforceable or invalid, that provision
          will be limited or eliminated to the minimum extent necessary, and the remaining
          provisions will remain in full force and effect.
        </Section>

        <Section title="15. Contact">
          <p>For questions about these Terms, contact:</p>
          <p style={{ marginTop: 12 }}>
            <strong style={{ color: "#FF7A00" }}>Silent Oracle</strong>
            <br />
            Email: legal@silentoracle.app
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#FF7A00",
          marginBottom: 12,
          fontFamily: "Georgia, serif",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: "#CCCCCC",
        }}
      >
        {children}
      </div>
    </section>
  );
}
