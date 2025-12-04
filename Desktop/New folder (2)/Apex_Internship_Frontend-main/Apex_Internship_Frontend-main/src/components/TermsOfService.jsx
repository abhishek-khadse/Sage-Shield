import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  FileText,
  Lock,
  Users,
} from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 py-16 px-6">

      {/* Centered container at dashboard width */}
      <div className="w-full max-w-[1650px] mx-auto space-y-14">

        {/* HEADER */}
        <div className="space-y-6">
          {/* Back Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          {/* Title */}
          <div className="flex items-center gap-5">
            {/* Icon with glow */}
            <div className="p-4 rounded-2xl bg-[#0f1626] border border-[#1f2b42] shadow-[0_0_20px_rgba(0,255,255,0.15)]">
              <FileText size={30} className="text-cyan-300" />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Terms of Service
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Last updated: November 28, 2025
              </p>
            </div>
          </div>
        </div>

        {/* SECTIONS WRAPPER */}
        <div className="space-y-10">

          <SectionBlock
            icon={<Shield size={20} className="text-cyan-300" />}
            title="1. Acceptance of Terms"
            children={
              <p className="leading-relaxed text-slate-300">
                By accessing and using NovaFi, you accept and agree to be bound
                by the terms and provisions of this agreement. If you do not
                agree to abide by the above, please do not use this service.
              </p>
            }
          />

          <SectionBlock
            icon={<Users size={20} className="text-cyan-300" />}
            title="2. Web3 Authentication"
            children={
              <div className="space-y-3">
                <p className="text-slate-300">
                  NovaFi uses blockchain-based authentication through Web3
                  wallets. By using our service, you:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Grant us permission to verify wallet ownership</li>
                  <li>Allow us to store authentication tokens securely</li>
                  <li>Understand that blockchain transactions are irreversible</li>
                  <li>Are responsible for keeping your private keys safe</li>
                </ul>

                <p className="text-xs text-slate-500">
                  We never have access to your private keys or funds. We only
                  verify wallet ownership for authentication purposes.
                </p>
              </div>
            }
          />

          <SectionBlock
            icon={<Eye size={20} className="text-cyan-300" />}
            title="3. Privacy and Data Use"
            children={
              <div className="space-y-3">
                <p className="text-slate-300">We are committed to protecting your privacy:</p>

                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>We collect only necessary information for service provision</li>
                  <li>Wallet addresses are used solely for authentication</li>
                  <li>We do not sell or share your personal data with third parties</li>
                  <li>You may request data deletion at any time</li>
                </ul>
              </div>
            }
          />

          <SectionBlock
            icon={<Lock size={20} className="text-cyan-300" />}
            title="4. Security Responsibilities"
            children={
              <div className="space-y-3">
                <p className="text-slate-300">As a user, you are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Securing your wallet and private keys</li>
                  <li>Using strong passwords and 2FA when possible</li>
                  <li>Verifying transaction details before signing</li>
                  <li>Reporting vulnerabilities responsibly</li>
                </ul>
              </div>
            }
          />

          <SectionBlock
            title="5. Service Availability"
            children={
              <p className="text-slate-300">
                NovaFi aims to provide reliable service but cannot guarantee 100% uptime. 
                The service is provided “as is” without warranties of any kind.
              </p>
            }
          />

          <SectionBlock
            title="6. Limitation of Liability"
            children={
              <p className="text-slate-300">
                NovaFi is not liable for indirect or consequential damages, including 
                loss of funds or data, resulting from service use.
              </p>
            }
          />

          <SectionBlock
            title="7. Changes to Terms"
            children={
              <p className="text-slate-300">
                We reserve the right to modify these terms at any time. Your continued 
                use of the service constitutes acceptance of any changes.
              </p>
            }
          />

        </div>

        {/* FOOTER */}
        <div className="pt-10 border-t border-[#1f2b42]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              Questions? Contact us at legal@novafi.io
            </p>

            <div className="flex gap-6">
              <Link className="text-cyan-300 hover:text-white text-sm transition">
                Privacy Policy
              </Link>
              <Link className="text-cyan-300 hover:text-white text-sm transition">
                Help Center
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const SectionBlock = ({ icon, title, children }) => (
  <div className="bg-[#0b1120] p-8 rounded-2xl border border-[#1c273d] shadow-[0_0_25px_rgba(20,50,100,0.22)]">

    {/* Section Header */}
    <div className="flex items-center gap-3 mb-4">
      {icon && (
        <div className="p-2 rounded-lg bg-[#102033] border border-[#1e2f4a] shadow-[0_0_10px_rgba(0,255,255,0.15)]">
          {icon}
        </div>
      )}
      {title && (
        <h2 className="text-xl font-bold text-white tracking-wide">
          {title}
        </h2>
      )}
    </div>

    {/* Content */}
    <div className="space-y-4">{children}</div>
  </div>
);

export default TermsOfService;
