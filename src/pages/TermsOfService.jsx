import React from 'react';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#050505] font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />
      
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </header>

          <div className="prose prose-invert prose-sm max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                By accessing or using kofiLartey Studio services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">2. Service Description</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                kofiLartey Studio provides a cloud-based platform for photographers to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Upload, store, and manage photographic galleries</li>
                <li>Share galleries with clients for proofing and selection</li>
                <li>Process payments for print and digital orders</li>
                <li>Manage client communications and project workflows</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly notify us of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">4. Content Ownership and License</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                <strong className="text-white">Your Content:</strong> You retain all rights to content you upload. By uploading, you grant us a non-exclusive license to store, display, and transmit your content solely to provide our services.
              </p>
              <p className="text-gray-400 leading-relaxed">
                <strong className="text-white">Our Content:</strong> All platform code, design, and functionality remain our property. You may not reverse engineer, copy, or distribute our proprietary materials.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">5. Acceptable Use</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Upload unlawful, harmful, or infringing content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Use our services for impersonation or fraud</li>
                <li>Automate access beyond what we provide</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">6. Payment Terms</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                <strong className="text-white">Subscription Fees:</strong> Paid plans are billed in advance on a recurring basis. All fees are exclusive of taxes.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                <strong className="text-white">Refunds:</strong> We offer a 14-day money-back guarantee. Contact support for refund requests.
              </p>
              <p className="text-gray-400 leading-relaxed">
                <strong className="text-white">Late Payments:</strong> Accounts may be suspended for non-payment. We may charge a $15 reactivation fee.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">7. Termination</h2>
              <p className="text-gray-400 leading-relaxed">
                Either party may terminate this agreement. Upon termination, we may delete your account data after 30 days. You remain responsible for any fees incurred before termination.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-400 leading-relaxed">
                SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-400 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE 12 MONTHS PRECEDING THE CLAIM. WE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">10. Indemnification</h2>
              <p className="text-gray-400 leading-relaxed">
                You agree to indemnify and hold harmless kofiLartey Studio from any claims, damages, or expenses arising from your content, violation of these terms, or infringement of third-party rights.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">11. Governing Law</h2>
              <p className="text-gray-400 leading-relaxed">
                These terms are governed by the laws of the jurisdiction where kofiLartey Studio operates, without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">12. Contact Information</h2>
              <p className="text-gray-400 leading-relaxed">
                For questions about these terms, contact us at <a href="mailto:kofilartey12@gmail.com" className="text-indigo-400 hover:text-indigo-300">kofilartey12@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;