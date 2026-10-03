import React from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-8 py-10 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
            <h1 className="text-3xl font-extrabold">Terms of Service</h1>
          </div>
          <p className="text-slate-400">Effective Date: October 2026</p>
        </div>
        
        <div className="p-8 space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-emerald-500"/> 1. Acceptance of Terms</h2>
            <p>By accessing and using the Zappkode Connect CRM platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Description of Service</h2>
            <p>Zappkode Connect CRM provides agencies and their clients with access to a rich collection of resources, including but not limited to content calendars, asset management, approval workflows, and automated social media publishing tools (the "Service").</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-amber-500"/> 3. User Conduct and Content</h2>
            <p>You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from which such Content originated. Zappkode reserves the right to suspend accounts that upload illegal or unauthorized content.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. API Usage and Third-Party Platforms</h2>
            <p>The Service may integrate with third-party platforms (e.g., Meta, Instagram). You agree to comply with the Terms of Service of those third-party platforms. Zappkode is not responsible for any bans, suspensions, or penalties applied to your social media accounts by third-party platforms due to content published via our CRM.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Modifications to Service</h2>
            <p>Zappkode reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that Zappkode shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact Information</h2>
            <p>For any questions regarding these Terms of Service, please contact legal@zappkode.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
