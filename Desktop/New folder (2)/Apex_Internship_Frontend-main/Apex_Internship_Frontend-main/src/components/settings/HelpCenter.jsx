import React, { useState } from "react";
import { Search, MessageSquare, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

const HelpCenter = () => {
  return (
    <div className="space-y-10">

      {/* SEARCH HERO */}
      <div className="relative rounded-2xl p-10 text-center text-white bg-gradient-to-br from-[#0f172a] via-[#1e2a44] to-[#0b1120] overflow-hidden border border-[#1f2a40] shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.07]"></div>

        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-5 tracking-tight text-white">How can we help you?</h2>

          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0b1120] border border-[#1f2a40] text-slate-200 font-medium placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* FAQ SECTION */}
        <div>
          <h3 className="text-xl font-bold text-white mb-5">Common Questions</h3>

          <div className="space-y-4">
            <FaqItem question="How do I reset my password?" />
            <FaqItem question="Where can I find my certificate?" />
            <FaqItem question="How to access the VPN lab?" />
            <FaqItem question="Can I change my internship track?" />
          </div>
        </div>

        {/* CONTACT SUPPORT CARD */}
        <div className="bg-[#0b1220] border border-[#1c273d] rounded-2xl p-8 shadow-lg h-fit">

          <h3 className="text-lg font-bold text-white mb-2">Still need help?</h3>
          <p className="text-sm text-slate-400 mb-6">
            Our support team is available Mon–Fri, 9am – 5pm.
          </p>

          <form className="space-y-5">
            {/* Subject */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Subject
              </label>

              <select className="w-full p-3 rounded-xl bg-[#0f172a] border border-[#1f2a40] text-sm text-slate-200 font-medium focus:outline-none focus:border-indigo-500">
                <option>Technical Issue</option>
                <option>Billing Inquiry</option>
                <option>Course Content</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Message
              </label>

              <textarea
                rows="4"
                placeholder="Describe your issue..."
                className="w-full p-3 rounded-xl bg-[#0f172a] border border-[#1f2a40] text-sm text-slate-200 placeholder-slate-500 font-medium focus:outline-none focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-black font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-neon">
              <MessageSquare size={18} /> Send Ticket
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

const FaqItem = ({ question }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className="rounded-xl border border-[#1c273d] bg-[#0f172a] p-5 cursor-pointer transition-all hover:border-indigo-500/40 group"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400">
          {question}
        </span>

        <span className="text-slate-400 group-hover:text-indigo-400 transition">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </div>

      {/* Expanded Answer */}
      {open && (
        <p className="text-sm text-slate-400 mt-3 leading-relaxed border-t border-[#1c273d] pt-3">
          We will generate detailed answers later. You can fill these with
          your platform's actual help content.
        </p>
      )}
    </div>
  );
};

export default HelpCenter;
