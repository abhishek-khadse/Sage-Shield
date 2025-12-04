import React from 'react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Heart, 
  ExternalLink 
} from 'lucide-react';

// Ensure this matches your logo path
const LOGO_PATH = "/image/AlbusSecurityLogoBlack.jpg"; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Changed border-slate-200 to border-slate-300 for better visibility
    <footer className="bg-white border-t border-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand Identity */}
          <div className="col-span-1 md:col-span-1">
            {/* Replaced Icon with Actual Logo Image */}
            <div className="mb-4">
              <img 
                src={LOGO_PATH} 
                alt="Albus Security Logo" 
                className="h-12 w-auto object-contain" 
              />
            </div>
            
            {/* Darker Text (slate-600 instead of slate-500) */}
            <p className="text-sm font-medium text-slate-600 leading-relaxed mb-2">
              The Apex Internship is a premier educational initiative by <strong>Albus Security LLP</strong>.
            </p>
            <p className="text-xs text-slate-500">
              Empowering the next generation of cybersecurity professionals.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3">
              <FooterLink label="My Dashboard" />
              <FooterLink label="Browse Courses" />
              <FooterLink label="Mentorship Program" />
              <FooterLink label="Achievements" />
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3">
              <FooterLink label="Help Center" />
              <FooterLink label="Report a Bug" />
              <FooterLink label="Privacy Policy" />
              <FooterLink label="Terms of Service" />
            </ul>
          </div>

          {/* Col 4: Connect & Status */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex items-center gap-4 mb-6">
              <SocialIcon icon={<Github size={20} />} />
              <SocialIcon icon={<Linkedin size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
            </div>
            
            {/* Status Indicator - Enhanced styling */}
            <div className="inline-flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 shadow-sm shadow-emerald-500/50"></span>
              </span>
              <span className="text-xs font-bold text-slate-700">Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Darker Border & Text */}
        <div className="pt-8 border-t border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-600">
            &copy; {currentYear} Albus Security LLP. All rights reserved.
          </p>
          
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <span>Designed with</span>
            <Heart size={14} className="text-rose-600 fill-rose-600" />
            <span>for The Apex Project</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

/* --- Sub-Components --- */

const FooterLink = ({ label }) => (
  <li>
    <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-700 hover:underline transition-all duration-300 flex items-center gap-1 group hover:translate-x-1">
      {label}
      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-slate-400 group-hover:translate-x-0.5" />
    </a>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a href="#" className="text-slate-500 hover:text-indigo-700 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 p-2.5 rounded-xl transition-all duration-300 border border-transparent hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/20 hover:-translate-y-1">
    <span className="transition-transform duration-300 group-hover:scale-110">
      {icon}
    </span>
  </a>
);

export default Footer;