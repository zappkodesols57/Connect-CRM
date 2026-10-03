import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, ArrowLeft, RefreshCw, Trash2, FileCheck, Mail, Globe } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition" />
            <span>Back to Connect CRM Hub</span>
          </Link>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="text-blue-400 font-bold border-b-2 border-blue-400 pb-1">Privacy Policy</span>
            <Link to="/terms" className="text-slate-400 hover:text-slate-200 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-8">
        {/* Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900/60 via-slate-900 to-slate-900 border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Privacy Policy</h1>
              <p className="text-xs text-blue-300 mt-0.5">Zappkode Solutions • Connect CRM Social Media Engine</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            This Privacy Policy details how Connect CRM collects, handles, stores, and protects corporate and personal data when you use our multi-portal marketing platform and third-party social media integrations.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700">Effective: October 2026</span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">Meta & Google Review Compliant</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">DPDP Act (India) & GDPR Aligned</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Eye className="w-4 h-4 text-blue-400" />
              <h2>1. Information We Collect</h2>
            </div>
            <p>
              Connect CRM processes only the data essential to executing scheduled social media campaigns, client approvals, and employee workflow management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <p className="font-bold text-white text-xs">Directly Provided Data</p>
                <p className="text-xs text-slate-400">
                  Client organization profiles, brand names, visual logos, target deliverable quotas, employee contact credentials, and custom content pillars.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <p className="font-bold text-white text-xs">Content & Media Assets</p>
                <p className="text-xs text-slate-400">
                  Video reel footage, carousel slides, captions, hashtags, visual creative briefs, review feedback, and internal task assignees.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Globe className="w-4 h-4 text-purple-400" />
              <h2>2. Meta Platform (Facebook & Instagram) API Data Usage</h2>
            </div>
            <p>
              When connecting your professional social media accounts for automated publishing or metric tracking via the Meta Graph API, our application complies strictly with Meta’s Platform Terms and Developer Policies:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                <strong className="text-slate-200">Permissions Requested:</strong> We request <code className="text-purple-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">pages_show_list</code>, <code className="text-purple-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">instagram_basic</code>, and <code className="text-purple-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">instagram_content_publish</code> solely to render previews and broadcast approved media.
              </li>
              <li>
                <strong className="text-slate-200">No Data Resale:</strong> We never sell, lease, or monetize data retrieved through Meta APIs.
              </li>
              <li>
                <strong className="text-slate-200">No Advertising or Surveillance:</strong> Meta user IDs and tokens are used exclusively within your authenticated agency account to schedule posts you have explicitly authorized.
              </li>
            </ul>
          </section>

          {/* Section 3: Data Deletion Callback Instructions (Critical for Meta Review) */}
          <section className="space-y-3 p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <h2>3. User Data Deletion Instructions (Meta & Account Erasure)</h2>
            </div>
            <p className="text-xs text-slate-300">
              In accordance with Meta Developer Policies and global privacy regulations, users have the right to request deletion of all data associated with their account and connected pages at any time.
            </p>
            <div className="space-y-2 pt-1">
              <p className="font-semibold text-slate-200 text-xs">How to request data deletion:</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-400">
                <li>Send an email to <span className="text-blue-300 font-mono font-bold">privacy@zappkode.com</span> with the subject line <strong>"Data Deletion Request - Connect CRM"</strong>.</li>
                <li>Include your organization name or registered client email address.</li>
                <li>Our team will process your request, unbind all Meta Page Access Tokens, and wipe corresponding calendar data from our SQLite/PostgreSQL instances within <strong>48 business hours</strong>.</li>
                <li>A formal confirmation email and tracking confirmation code will be dispatched once deletion is complete.</li>
              </ol>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h2>4. Security & Data Protection</h2>
            </div>
            <p>
              Connect CRM implements industry-standard technical measures to safeguard your credentials and media assets:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Role-based access separation ensuring client brands cannot inspect other client calendars.</li>
              <li>HTTPS/TLS encryption on all client-server communications and REST API endpoints.</li>
              <li>Access tokens and credentials stored securely with salted password hashing.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <h2>5. Your Rights</h2>
            </div>
            <p>
              Depending on your jurisdiction, you maintain the right to access, export, rectify, or request restriction of processing for your personal and company information. Contact our compliance desk to exercise any of these entitlements.
            </p>
          </section>

          {/* Contact Details */}
          <section className="pt-4 border-t border-slate-800 space-y-2">
            <p className="font-bold text-white text-sm">Contact Compliance & Legal Officer</p>
            <p className="text-xs text-slate-400">
              Zappkode Solutions Private Limited • Social Media Agency Division
            </p>
            <div className="flex items-center space-x-4 text-xs pt-1">
              <span className="flex items-center space-x-1.5 text-blue-400">
                <Mail className="w-3.5 h-3.5" />
                <span>privacy@zappkode.com</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Nagpur, Maharashtra, India</span>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Zappkode Solutions • Connect CRM Platform • All Rights Reserved</p>
      </footer>
    </div>
  );
};
