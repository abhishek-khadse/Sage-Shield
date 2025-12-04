import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Cookie,
  Lock,
  Mail,
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-300">
      <div className="max-w-[1650px] mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          <div className="flex items-center gap-4 mb-4">
            {/* ICON BADGE */}
            <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(0,255,111,0.25)]">
              <Shield className="w-6 h-6 text-green-400" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">
                Privacy Policy
              </h1>
              <p className="text-slate-400 text-sm">
                Last updated: November 28, 2025
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-8">

          {/* SECTION TEMPLATE */}
          <Section
            icon={<Eye className="w-5 h-5 text-green-400" />}
            title="1. Information We Collect"
          >
            <p>
              We collect minimal information necessary to provide our Web3 authentication service:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Wallet Address:</strong> Public blockchain wallet address for authentication</li>
              <li><strong>Authentication Tokens:</strong> JWT tokens for session management</li>
              <li><strong>Usage Data:</strong> Anonymous usage patterns and analytics</li>
              <li><strong>Browser Data:</strong> Browser type, language, and timezone for optimization</li>
            </ul>

            <p className="text-sm bg-blue-900/30 border border-blue-700/30 text-blue-300 p-3 rounded mt-2">
              We never collect private keys, seed phrases, or financial information.
            </p>
          </Section>

          <Section
            icon={<Database className="w-5 h-5 text-green-400" />}
            title="2. How We Use Your Information"
          >
            <p>Your information is used exclusively for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authenticating your identity via Web3 wallet signatures</li>
              <li>Maintaining your session and preferences</li>
              <li>Providing customer support when requested</li>
              <li>Improving our service through anonymous analytics</li>
              <li>Ensuring platform security and preventing fraud</li>
            </ul>
          </Section>

          <Section
            icon={<Cookie className="w-5 h-5 text-green-400" />}
            title="3. Cookies and Local Storage"
          >
            <p>We use browser storage for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Session Storage:</strong> JWT tokens for active sessions</li>
              <li><strong>Local Storage:</strong> User preferences and settings</li>
              <li><strong>Cookies:</strong> Essential functionality and analytics</li>
            </ul>
            <p className="text-sm text-slate-400">
              All stored data is encrypted and accessible only to your browser session.
            </p>
          </Section>

          <Section
            icon={<Shield className="w-5 h-5 text-green-400" />}
            title="4. Data Security"
          >
            <p>We implement multiple security measures:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encryption for all transmissions</li>
              <li>Secure token storage with expiration</li>
              <li>Regular security audits & penetration testing</li>
              <li>Compliance with Web3 security best practices</li>
              <li>No storage of sensitive blockchain data</li>
            </ul>
          </Section>

          <Section
            icon={<Lock className="w-5 h-5 text-green-400" />}
            title="5. Data Sharing and Third Parties"
          >
            <p>We do not sell, rent, or share your personal data. We only share:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anonymous analytics with service providers</li>
              <li>Information required by law</li>
              <li>Data needed to prevent fraud or threats</li>
            </ul>
          </Section>

          <Section title="6. Your Rights and Choices">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your stored data at any time</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of analytics tracking</li>
              <li>Export your data</li>
              <li>Revoke authentication tokens</li>
            </ul>
          </Section>

          <Section title="7. Blockchain Transparency">
            <p>
              Your wallet address and on-chain interactions are public. We use this only for authentication
              and never link it with personal data without your consent.
            </p>
          </Section>

          <Section title="8. International Data Transfers">
            <p>
              We store data globally with strict safeguards to ensure privacy across regions.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              Our service is not intended for users under 13. If we detect such information, we remove it immediately.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this policy over time. Your continued use constitutes acceptance of the updated terms.
            </p>
          </Section>
        </div>

        {/* CONTACT BOX */}
        <div className="mt-12 p-6 bg-green-900/10 rounded-xl border border-green-500/20">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <h3 className="font-semibold text-green-300 mb-2">Privacy Questions?</h3>
              <p className="text-slate-400 text-sm mb-2">
                If you have questions or want to exercise your privacy rights, reach out to our team.
              </p>
              <p className="text-green-400 font-medium">privacy@novafi.io</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;



/* REUSABLE SECTION COMPONENT */
const Section = ({ title, icon, children }) => (
  <section className="bg-[#0b1120] p-6 rounded-xl border border-[#1c273d] shadow-md shadow-black/30">
    <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    <div className="space-y-3 text-slate-300">{children}</div>
  </section>
);
